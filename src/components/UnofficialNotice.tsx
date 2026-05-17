/**
 * 「Microsoft公式ではない」ことを明示する上部Notice
 * ヘッダー直下に常時表示。一番目立つ位置で誤認を防ぐ。
 */
export function UnofficialNotice() {
  return (
    <div className="unofficial-notice">
      <div className="inner">
        <span className="icon">⚠️</span>
        <div className="lines">
          <div>
            <strong>本サイトはMicrosoft公式ではありません</strong>
          </div>
          <div>価格・仕様は参考情報です</div>
        </div>
      </div>
    </div>
  );
}
