import { useCountUp } from '../hooks/useCountUp';

function StatCard({ label, value, prefix = '', decimals = 0, accent }) {
  const animated = useCountUp(value);
  const display = decimals > 0 ? animated.toFixed(decimals) : Math.round(animated);

  return (
    <div className={`stat-card stat-card--${accent}`}>
      <div className="stat-card__glow" />
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">
        {prefix}
        {display.toLocaleString()}
      </div>
    </div>
  );
}

export default function StatCards({ items }) {
  const totalItems = items.length;
  const lowStockCount = items.filter((i) => i.quantity <= i.reorderThreshold).length;
  const totalValue = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  return (
    <div className="stat-cards" data-testid="stat-cards">
      <StatCard label="Total SKUs" value={totalItems} accent="blue" />
      <StatCard label="Low Stock Alerts" value={lowStockCount} accent="orange" />
      <StatCard label="Total Inventory Value" value={totalValue} prefix="$" decimals={2} accent="green" />
    </div>
  );
}
