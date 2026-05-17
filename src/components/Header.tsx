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
            <span className="badge">Unofficial</span>
            Microsoft License Reference (Unofficial)
          </h1>
          <p>個人制作によるMicrosoftライセンス比較・参考情報サイト</p>
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
