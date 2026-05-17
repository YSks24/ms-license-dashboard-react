/**
 * 製品選択ドロップダウン（再利用部品）
 *
 * 親から「現在選ばれているキー」と「変わったとき呼ぶ関数」を受け取る。
 * 製品はカテゴリでグループ化（<optgroup>）して表示する。
 *
 * 使い方：
 *   <ProductSelect value={productKey} onChange={setProductKey} />
 */
import { useMemo } from "react";
import { PRODUCTS } from "../../data/products";

interface ProductSelectProps {
  value: string;
  onChange: (productKey: string) => void;
  label?: string;
}

export function ProductSelect({
  value,
  onChange,
  label = "製品",
}: ProductSelectProps) {
  // カテゴリ別にグループ化（毎回計算しないよう useMemo でキャッシュ）
  const groups = useMemo(() => {
    const g: Record<string, Array<{ key: string; label: string; isNew?: boolean }>> = {};
    Object.entries(PRODUCTS).forEach(([key, p]) => {
      const cat = p.category || "その他";
      if (!g[cat]) g[cat] = [];
      g[cat].push({ key, label: p.label, isNew: p.isNew });
    });
    return g;
  }, []);

  return (
    <div className="form-group">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {Object.entries(groups).map(([cat, items]) => (
          <optgroup key={cat} label={cat}>
            {items.map((it) => (
              <option key={it.key} value={it.key}>
                {it.label}
                {it.isNew ? " 🆕" : ""}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
