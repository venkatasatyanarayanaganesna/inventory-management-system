import { useRef } from 'react';

export default function ItemCard({ item, onEdit, onDelete }) {
  const cardRef = useRef(null);
  const lowStock = item.quantity <= item.reorderThreshold;

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max tilt of 10deg, direction based on cursor offset from center.
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;

    // Glare follows the cursor.
    const glare = card.querySelector('.item-card__glare');
    if (glare) {
      glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.25), transparent 60%)`;
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  };

  return (
    <div
      ref={cardRef}
      className={`item-card ${lowStock ? 'item-card--low-stock' : ''}`}
      data-testid={`item-row-${item.sku}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="item-card__glare" />

      {lowStock && (
        <span className="low-stock-badge" data-testid={`low-stock-badge-${item.sku}`}>
          ⚠ Low Stock
        </span>
      )}

      <div className="item-card__sku">{item.sku}</div>
      <h3 className="item-card__name">{item.name}</h3>
      <div className="item-card__category">{item.category}</div>

      <div className="item-card__stats">
        <div>
          <span className="item-card__stat-label">Qty</span>
          <span className="item-card__stat-value">{item.quantity}</span>
        </div>
        <div>
          <span className="item-card__stat-label">Reorder At</span>
          <span className="item-card__stat-value">{item.reorderThreshold}</span>
        </div>
        <div>
          <span className="item-card__stat-label">Price</span>
          <span className="item-card__stat-value">${item.unitPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="item-card__location">📍 {item.location}</div>

      <div className="item-card__actions">
        <button data-testid={`edit-${item.sku}`} onClick={() => onEdit(item)}>
          Edit
        </button>
        <button
          className="item-card__delete-btn"
          data-testid={`delete-${item.sku}`}
          onClick={() => onDelete(item)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
