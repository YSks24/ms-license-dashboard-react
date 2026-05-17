/** Microsoftのグローバル価格改定イベント（MPSAタイムライン用） */
export interface PricingEvent {
  year: number;
  month?: number;
  label: string;
}

export const PRICING_EVENTS: PricingEvent[] = [
  { year: 2022, month: 3, label: "NCE導入 / グローバル価格改定（USD +15%相当）" },
  { year: 2023, month: 4, label: "Microsoft Japan 為替調整値上げ（約15-20%）" },
  { year: 2024, month: 4, label: "Microsoft Japan 円安再調整（約10-15%）" },
  { year: 2026, month: 5, label: "M365 E7 Frontier Suite GA" },
  { year: 2026, month: 7, label: "グローバル価格改定（製品ベースアップ）" },
];
