export default function SearchBar({ value, onChange, onLowStockToggle, lowStockOnly }) {
  return (
    <div className="search-bar">
      <input
        data-testid="search-input"
        type="text"
        placeholder="Search by SKU, name, or category..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <label className="low-stock-filter">
        <input
          data-testid="low-stock-filter-checkbox"
          type="checkbox"
          checked={lowStockOnly}
          onChange={(e) => onLowStockToggle(e.target.checked)}
        />
        Low stock only
      </label>
    </div>
  );
}
