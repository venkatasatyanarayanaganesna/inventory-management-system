import ItemCard from './ItemCard';

export default function ItemList({ items, onEdit, onDelete }) {
  if (items.length === 0) {
    return <p className="empty-state" data-testid="empty-state">No inventory items found.</p>;
  }

  return (
    <div className="item-grid" data-testid="item-table">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
