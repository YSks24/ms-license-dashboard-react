/** KPIカード（再利用部品） */
import type { ReactNode } from "react";

interface KpiCardProps {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  accent?: "red" | "orange" | "green" | "default";
}

export function KpiCard({
  label, value, sub, accent = "default",
}: KpiCardProps) {
  const cls = accent === "default" ? "kpi-card" : `kpi-card accent-${accent}`;
  return (
    <div className={cls}>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  );
}
