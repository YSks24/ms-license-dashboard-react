/**
 * ルートコンポーネント
 * ヘッダー / 速報バー / 免責 / タブナビ / アクティブタブの中身
 * を組み立てる司令塔。
 */
import { useState } from "react";
// ★ Chart.jsの登録（アプリ起動時に1度だけ）
import "./utils/chartSetup";

import { Header } from "./components/Header";
import { NewsBar } from "./components/NewsBar";
import { Disclaimer } from "./components/Disclaimer";
import { TabNav } from "./components/TabNav";
import { OverviewTab } from "./components/tabs/OverviewTab";
import { NewsTab } from "./components/tabs/NewsTab";
import { EaSimulatorTab } from "./components/tabs/EaSimulatorTab";
import { ConfigSimulatorTab } from "./components/tabs/ConfigSimulatorTab";
import { FxSimulatorTab } from "./components/tabs/FxSimulatorTab";
import { MpsaTimelineTab } from "./components/tabs/MpsaTimelineTab";
import { CompareTab } from "./components/tabs/CompareTab";
import { DataTab } from "./components/tabs/DataTab";
import { NEWS_ITEMS } from "./data/news";
import type { TabId, TabInfo } from "./types";
import "./styles/global.css";

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const handlePrint = () => window.print();
  const unreadNewsCount = NEWS_ITEMS.filter((n) => n.unread).length;

  const tabs: TabInfo[] = [
    { id: "overview", label: "概要" },
    { id: "news", label: "🔔 価格改定ニュース", badgeCount: unreadNewsCount },
    { id: "ea", label: "EA契約シミュレーター" },
    { id: "config", label: "構成シミュレーター" },
    { id: "fx", label: "為替IFシミュレーター" },
    { id: "mpsa", label: "MPSAタイムライン" },
    { id: "compare", label: "製品比較" },
    { id: "data", label: "データ / CSV" },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab />;
      case "news":     return <NewsTab />;
      case "ea":       return <EaSimulatorTab />;
      case "config":   return <ConfigSimulatorTab />;
      case "fx":       return <FxSimulatorTab />;
      case "mpsa":     return <MpsaTimelineTab />;
      case "compare":  return <CompareTab />;
      case "data":     return <DataTab />;
    }
  };

  return (
    <>
      <Header onPrintClick={handlePrint} />
      <NewsBar onClickJump={() => setActiveTab("news")} />
      <Disclaimer />
      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="app-main">{renderActiveTab()}</main>
    </>
  );
}

export default App;
