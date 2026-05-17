/**
 * 公式発表レターへのリンクボタン（再利用部品）
 *
 * link が渡されればクリック可能なリンク、
 * undefined（リンク未登録）ならグレーの「未登録」表示。
 */
import type { OfficialLink } from "../../types";

interface OfficialLinkButtonProps {
  link?: OfficialLink;
}

export function OfficialLinkButton({ link }: OfficialLinkButtonProps) {
  if (!link) {
    return <span className="official-link disabled">— 未登録</span>;
  }
  return (
    <a
      className="official-link"
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      title={link.label}
    >
      🔗 公式発表
    </a>
  );
}
