/**
 * 免責事項バナーコンポーネント
 *
 * Props なし（受け取る情報がない）のシンプルなコンポーネント。
 * 中身が固定文字列なので、関数だけ書けばOK。
 */
export function Disclaimer() {
  return (
    <div className="disclaimer">
      <div className="inner">
        <strong>⚠ 免責事項：</strong>
        当サイトの試算は過去の公開情報・報道を基にしたシミュレーション（参考値）であり、実際の見積価格・契約価格を保証するものではありません。
        実際の購買・契約交渉の際は
        <strong>
          必ずMicrosoft公式の最新発表、またはお取引のあるLSP・販売代理店にご確認ください。
        </strong>
      </div>
    </div>
  );
}
