/**
 * タブナビゲーション
 *
 * 親から3つの情報を受け取る：
 *   - tabs: 表示するタブのリスト
 *   - activeTab: 現在アクティブなタブID
 *   - onTabChange: タブをクリックされた時に呼ぶ関数
 *
 * 子から親に「クリックされた」と伝えるのは、コールバック関数を渡すパターン。
 * React では「状態は親が持ち、子はその表示と通知だけ」が基本。
 */
import type { TabId, TabInfo } from "../types";

interface TabNavProps {
  tabs: TabInfo[];
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
}

export function TabNav({ tabs, activeTab, onTabChange }: TabNavProps) {
  return (
    <nav className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={tab.id === activeTab ? "active" : ""}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
          {tab.badgeCount != null && tab.badgeCount > 0 && (
            <span className="news-count">{tab.badgeCount}</span>
          )}
        </button>
      ))}
    </nav>
  );
}
