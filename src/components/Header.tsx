/**
 * ヘッダーコンポーネント
 *
 * 親（App.tsx）から `onPrintClick` という関数を受け取って、
 * ボタンクリック時にそれを実行する。
 * → これが React の「props（プロップス）」の基本パターン
 */

// このコンポーネントが受け取る引数（props）の型を宣言
interface HeaderProps {
  /** PDF出力ボタンが押された時に呼ばれる関数（省略可） */
  onPrintClick?: () => void;
}

export function Header({ onPrintClick }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div>
          <h1>
            <span className="badge">v2.0</span>
            Microsoft 法人ライセンス 価格変動分析ダッシュボード
          </h1>
          <p>
            ESA・MPSAの値上げを「為替影響」と「Microsoft都合」に分解 ／ React版
          </p>
        </div>
        <div className="header-actions">
          {onPrintClick && (
            <button onClick={onPrintClick} className="btn-export">
              📄 PDF出力
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
