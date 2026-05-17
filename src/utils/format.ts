/**
 * 表示フォーマット系のユーティリティ関数
 * （旧 index.html の fmtJPY / fmtUSD などを移植）
 */

/** 数値 → "¥1,500" 形式 */
export const fmtJPY = (n: number): string =>
  "¥" + Math.round(n).toLocaleString();

/** 大きな金額を "1.23億円" "150万円" のように圧縮表示 */
export const fmtJPYM = (n: number): string => {
  const abs = Math.abs(n);
  if (abs >= 1e8) return (n / 1e8).toFixed(2) + "億円";
  if (abs >= 1e4) return Math.round(n / 1e4).toLocaleString() + "万円";
  return Math.round(n).toLocaleString() + "円";
};

/** 数値 → "$23.75" 形式（小数2桁） */
export const fmtUSD = (n: number): string => "$" + n.toFixed(2);

/** 数値 → "+12.5%" 形式（プラス符号付き） */
export const fmtPct = (n: number, withSign = true): string =>
  (n >= 0 && withSign ? "+" : "") + n.toFixed(1) + "%";

/** 為替レート → "152.00" 形式（小数2桁） */
export const fmtFx = (n: number): string => n.toFixed(2);
