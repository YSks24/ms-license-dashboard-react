/**
 * 価格分解ロジック（旧 index.html の decomposeChange / decomposeAbsolute を移植）
 *
 * 「JPY価格の総変動率 = MS都合 + 為替 + 日本独自」を
 * 対数分解（log-decomposition）で厳密に3要素に分ける。
 *
 *   log(JPY_B/JPY_A) = log(USD_B/USD_A) + log(FX_B/FX_A) + log(残差)
 *
 * 各要素の寄与率（%pt）の合計 = 総変動率（%）
 */
import { PRODUCTS } from "../data/products";
import { FX_BY_YEAR } from "../data/fxRates";
import type { PriceDecomposition, AbsoluteDecomposition } from "../types";

/** 指定製品の指定年にデータが存在するか */
export function hasData(productKey: string, year: number): boolean {
  const p = PRODUCTS[productKey];
  if (!p) return false;
  return p.usd[year] != null && p.jpy[year] != null;
}

/** 製品の利用可能な年（データがある年）の配列を返す */
export function productAvailableYears(productKey: string): number[] {
  const p = PRODUCTS[productKey];
  if (!p) return [];
  return Object.keys(p.usd)
    .map(Number)
    .filter((y) => hasData(productKey, y))
    .sort((a, b) => a - b);
}

/**
 * 年A→年Bの価格変動を3要素に分解する
 * @param productKey 製品キー（"M365_E3" など）
 * @param yearA 基準年
 * @param yearB 比較年
 */
export function decomposeChange(
  productKey: string,
  yearA: number,
  yearB: number
): PriceDecomposition {
  const p = PRODUCTS[productKey];
  const usdA = p?.usd[yearA];
  const usdB = p?.usd[yearB];
  const jpyA = p?.jpy[yearA];
  const jpyB = p?.jpy[yearB];
  const fxA = FX_BY_YEAR[yearA];
  const fxB = FX_BY_YEAR[yearB];

  // データが揃っていない場合は unavailable: true で返す
  if (usdA == null || usdB == null || jpyA == null || jpyB == null) {
    return {
      yearA, yearB,
      usdA: 0, usdB: 0, jpyA: 0, jpyB: 0, fxA: 0, fxB: 0,
      totalRatio: 0, msRatio: 0, fxRatio: 0, localRatio: 0,
      totalPct: 0, msPct: 0, fxPct: 0, localPct: 0,
      unavailable: true,
    };
  }

  const totalRatio = jpyB / jpyA;
  const msRatio = usdB / usdA;
  const fxRatio = fxB / fxA;
  const localRatio = totalRatio / (msRatio * fxRatio);
  const totalPct = (totalRatio - 1) * 100;

  // 対数分解
  const lnTotal = Math.log(totalRatio);
  let msPct: number, fxPct: number, localPct: number;
  if (Math.abs(lnTotal) < 1e-9) {
    // 価格変動なし
    msPct = 0; fxPct = 0; localPct = 0;
  } else {
    msPct = (Math.log(msRatio) / lnTotal) * totalPct;
    fxPct = (Math.log(fxRatio) / lnTotal) * totalPct;
    localPct = (Math.log(localRatio) / lnTotal) * totalPct;
  }

  return {
    yearA, yearB, usdA, usdB, jpyA, jpyB, fxA, fxB,
    totalRatio, msRatio, fxRatio, localRatio,
    totalPct, msPct, fxPct, localPct,
  };
}

/**
 * 年Yの「JPY価格を絶対値ベースで分解」
 * 戻り値：基準価格 + MS追加 + FX追加 + 日本独自追加 = 当年JPY価格
 */
export function decomposeAbsolute(
  productKey: string,
  year: number,
  baseYear: number
): AbsoluteDecomposition {
  const p = PRODUCTS[productKey];
  if (!hasData(productKey, year) || !hasData(productKey, baseYear)) {
    return { base: 0, msAdd: 0, fxAdd: 0, localAdd: 0, total: 0, na: true };
  }
  const baseJpy = p.jpy[baseYear]!;
  const currentJpy = p.jpy[year]!;
  const totalAdd = currentJpy - baseJpy;
  if (year === baseYear || Math.abs(totalAdd) < 1e-9) {
    return { base: baseJpy, msAdd: 0, fxAdd: 0, localAdd: 0, total: currentJpy };
  }
  const dec = decomposeChange(productKey, baseYear, year);
  if (Math.abs(dec.totalPct) < 1e-9) {
    return { base: baseJpy, msAdd: 0, fxAdd: 0, localAdd: 0, total: currentJpy };
  }
  return {
    base: baseJpy,
    msAdd:    totalAdd * (dec.msPct    / dec.totalPct),
    fxAdd:    totalAdd * (dec.fxPct    / dec.totalPct),
    localAdd: totalAdd * (dec.localPct / dec.totalPct),
    total: currentJpy,
  };
}
