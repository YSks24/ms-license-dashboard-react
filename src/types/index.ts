/**
 * アプリ全体で使う型定義（TypeScriptの「設計図」）
 *
 * ここに「データの形」を定義しておくと、
 * 他のファイルでデータを使うとき VS Code が自動補完してくれる。
 * 間違った型を入れたらエディタが赤線で教えてくれる。
 */

// ============================================================
// 製品（ライセンス）
// ============================================================

/** 年 → 価格 のマップ。一部の年が欠けてもよい（M365 E7など2026年以降のみ） */
export type PriceByYear = Partial<Record<number, number>>;

/** 1つの製品の情報 */
export interface Product {
  label: string;             // 表示名："Microsoft 365 E3"
  category: string;          // カテゴリ："スイート（主要）"
  isNew?: boolean;           // 🆕 バッジを付けるか
  availableFrom?: number;    // 提供開始年（例：2026）
  usd: PriceByYear;          // 年→USD価格
  jpy: PriceByYear;          // 年→JPY価格
}

/** 全製品の辞書。キーは "M365_E3" のような識別子 */
export type ProductMap = Record<string, Product>;

// ============================================================
// 為替
// ============================================================

/** 年 → USD/JPYレート */
export type FxByYear = Record<number, number>;

// ============================================================
// ニュース
// ============================================================

/** ニュース出典の種類 */
export type SourceType = "official" | "news" | "estimate" | "analysis";

/** ニュースのソース（出典） */
export interface NewsSource {
  label: string;
  url: string | null;        // null の場合はリンクなし（モックデータなど）
  type: SourceType;
}

/** ニュースの重要度 */
export type NewsSeverity = "danger" | "warn" | "info" | "success";

/** 1つのニュース項目 */
export interface NewsItem {
  date: string;              // "YYYY-MM-DD"
  severity: NewsSeverity;
  badge: string;             // "値上げ予告" など
  title: string;
  body: string;
  targets?: string[];        // 関連製品のキー配列
  unread?: boolean;          // NEW バッジを付けるか
  sources?: NewsSource[];    // 出典リスト
}

// ============================================================
// 計算結果
// ============================================================

/** decomposeAbsolute() の戻り値：基準年からの絶対値分解 */
export interface AbsoluteDecomposition {
  base: number;
  msAdd: number;
  fxAdd: number;
  localAdd: number;
  total: number;
  na?: boolean;
}

/** decomposeChange() の戻り値：年Aから年Bへの価格変動の分解結果 */
export interface PriceDecomposition {
  yearA: number;
  yearB: number;
  usdA: number; usdB: number;
  jpyA: number; jpyB: number;
  fxA: number;  fxB: number;
  totalRatio: number; msRatio: number; fxRatio: number; localRatio: number;
  totalPct: number;
  msPct: number;      // MS都合（USDベースアップ）の寄与
  fxPct: number;      // 為替変動の寄与
  localPct: number;   // 日本独自改定の寄与
  unavailable?: boolean;
}

// ============================================================
// 公式リンク
// ============================================================

/** 1つの公式発表リンク */
export interface OfficialLink {
  label: string;
  url: string;
}

/** 年 → 公式リンク のマップ */
export type OfficialLinks = Partial<Record<number, OfficialLink>>;

// ============================================================
// タブナビゲーション
// ============================================================

/** タブを識別するID。新しいタブを足すときはここに追加 */
export type TabId =
  | "overview"
  | "news"
  | "ea"
  | "config"
  | "fx"
  | "mpsa"
  | "compare"
  | "data";

/** タブのメタ情報 */
export interface TabInfo {
  id: TabId;
  label: string;
  badgeCount?: number;   // タブ名横に赤バッジを表示する場合の数値（未読件数など）
}
