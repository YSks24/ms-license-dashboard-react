/**
 * ニュースタイムライン（旧 index.html の NEWS_ITEMS を移植）
 *
 * source.type:
 *   "official"  - Microsoft等の一次情報
 *   "news"      - メディア報道
 *   "estimate"  - モック / 予想
 *   "analysis"  - 業界分析
 *
 * URL が null の場合はリンクなしで表示（モック・未発表データ）。
 */
import type { NewsItem } from "../types";

export const NEWS_ITEMS: NewsItem[] = [
  {
    date: "2026-07-01", severity: "danger", badge: "値上げ予告",
    title: "2026年7月：グローバル価格改定 - 新価格適用予告",
    body: "Microsoftが7月1日付でグローバル価格改定を実施予定。M365 E3は$23.75→$26.50（+11.6%）、Entra ID P2は$9→$12（+33%）、Defender for Endpoint P2は$5.20→$6.50（+25%）など、セキュリティ系製品を中心に値上げ。",
    targets: ["M365_E3", "M365_E5", "DEFENDER_EP_P2", "ENTRA_P2"],
    unread: true,
    sources: [
      { label: "Microsoft 公式予告（モック / 未発表）", url: null, type: "estimate" },
      { label: "本サイト試算値", url: null, type: "estimate" },
    ],
  },
  {
    date: "2026-05-15", severity: "info", badge: "新製品",
    title: "M365 E7 (Frontier Suite) 一般提供開始",
    body: "AIエージェント機能を標準統合した最上位スイート「M365 E7 Frontier Suite」が$99/user/monthで一般提供開始。",
    targets: ["M365_E7"],
    unread: true,
    sources: [
      { label: "Microsoft 365 公式ブログ（仮）", url: "https://www.microsoft.com/en-us/microsoft-365/blog/", type: "official" },
      { label: "想定価格 / モック", url: null, type: "estimate" },
    ],
  },
  {
    date: "2026-04-15", severity: "warn", badge: "為替調整",
    title: "Microsoft Japan：円安連動値上げ実施",
    body: "USD/JPYが152円台で推移していることを受け、Microsoft Japanが日本円建てSRPを5-8%引き上げ。",
    targets: ["INTUNE", "ENTRA_P1", "ENTRA_P2"],
    unread: true,
    sources: [
      { label: "Microsoft Japan ビジネスニュース", url: "https://www.microsoft.com/ja-jp/biz/news/", type: "official" },
    ],
  },
  {
    date: "2025-11-01", severity: "info", badge: "リブランド",
    title: "Azure AD → Microsoft Entra ID 完全移行完了",
    body: "Azure Active Directory P1/P2は Microsoft Entra ID P1/P2 に名称変更を完了。価格・機能は据え置き。",
    targets: ["ENTRA_P1", "ENTRA_P2"],
    sources: [
      { label: "Microsoft Entra ID 公式", url: "https://www.microsoft.com/en-us/security/business/identity-access/microsoft-entra-id", type: "official" },
    ],
  },
  {
    date: "2024-04-01", severity: "warn", badge: "価格改定",
    title: "Microsoft Japan 円安再調整（約10-15%）",
    body: "M365 E3の日本価格が¥3140→¥3520（+12%）。USD価格据え置きで日本独自に円安連動。",
    targets: ["M365_E3", "M365_E5", "INTUNE"],
    sources: [
      { label: "Microsoft Japan 価格改定アナウンス", url: "https://www.microsoft.com/ja-jp/biz/news/", type: "official" },
      { label: "ITmedia エンタープライズ", url: "https://www.itmedia.co.jp/enterprise/", type: "news" },
    ],
  },
  {
    date: "2023-04-01", severity: "warn", badge: "価格改定",
    title: "Microsoft Japan 為替調整値上げ（約15-20%）",
    body: "M365 E3の日本価格が¥2750→¥3140（+14%）。USD価格は据え置きで日本円のみ調整。",
    targets: ["M365_E3", "M365_E5"],
    sources: [
      { label: "Microsoft Japan 公式発表", url: "https://www.microsoft.com/ja-jp/biz/news/", type: "official" },
      { label: "Publickey 報道", url: "https://www.publickey1.jp/", type: "news" },
    ],
  },
  {
    date: "2023-04-01", severity: "warn", badge: "値上げ",
    title: "Power BI Pro 価格改定 ($9.99→$14)",
    body: "Power BI Proの初の値上げ。全世界共通でUSD価格が約40%上昇。",
    targets: ["POWERBI_PRO"],
    sources: [
      { label: "Microsoft Power BI ブログ", url: "https://powerbi.microsoft.com/en-us/blog/", type: "official" },
    ],
  },
  {
    date: "2024-01-16", severity: "info", badge: "新製品",
    title: "Microsoft 365 Copilot エンタープライズ向け一般提供開始",
    body: "AIアシスタント「Microsoft 365 Copilot」のエンタープライズ向け一般提供を開始。$30/user/month、日本では¥4,497/user/monthで提供。M365 E3/E5のアドオン（追加ライセンス）として利用可能。",
    targets: ["M365_COPILOT"],
    sources: [
      { label: "Microsoft 365 Copilot 公式", url: "https://www.microsoft.com/microsoft-365/microsoft-365-copilot", type: "official" },
      { label: "Microsoft ブログ発表", url: "https://blogs.microsoft.com/blog/", type: "official" },
    ],
  },
  {
    date: "2022-03-01", severity: "info", badge: "商習慣変更",
    title: "New Commerce Experience (NCE) 導入 + グローバル価格改定",
    body: "NCEへの移行に伴い、M365 E3は$20→$23（+15%）、E5は$35→$38（+8.6%）の値上げを実施。",
    targets: ["M365_E3", "M365_E5", "O365_E3"],
    sources: [
      { label: "Microsoft Learn: NCE 発表アーカイブ", url: "https://learn.microsoft.com/en-us/partner-center/announcements/", type: "official" },
      { label: "ZDNET Japan 報道", url: "https://japan.zdnet.com/", type: "news" },
    ],
  },
];
