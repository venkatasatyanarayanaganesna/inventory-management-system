import { useState, useEffect } from 'react';

const emptyItem = {
  sku: '',
  name: '',
  category: '',
  quantity: '',
  reorderThreshold: '',
  unitPrice: '',
  location: '',
};

export default function ItemForm({ initialItem, onSubmit, onCancel, error }) {
  const [item, setItem] = useState(emptyItem);

  useEffect(() => {
    setItem(initialItem ? { ...initialItem } : emptyItem);
  }, [initialItem]);

  const handleChange = (field) => (e) => {
    setItem((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...item,
      quantity: Number(item.quantity),
      reorderThreshold: Number(item.reorderThreshold),
      unitPrice: Number(item.unitPrice),
    });
  };

  return (
    <form className="item-form" onSubmit={handleSubmit} data-testid="item-form">
      <h2>{initialItem ? 'Edit Item' : 'Add New Item'}</h2>

      {error && <div className="form-error" data-testid="form-error">{error}</div>}

      <label>
        SKU
        <input
          data-testid="input-sku"
          value={item.sku}
          onChange={handleChange('sku')}
          required
        />
      </label>

      <label>
        Name
        <input
          data-testid="input-name"
          value={item.name}
          onChange={handleChange('name')}
          required
        />
      </label>

      <label>
        Category
        <input
          data-testid="input-category"
          value={item.category}
          onChange={handleChange('category')}
          required
        />
      </label>

      <label>
        Quantity
        <input
          data-testid="input-quantity"
          type="number"
          min="0"
          value={item.quantity}
          onChange={handleChange('quantity')}
          required
        />
      </label>

      <label>
        Reorder Threshold
        <input
          data-testid="input-reorder-threshold"
          type="number"
          min="0"
          value={item.reorderThreshold}
          onChange={handleChange('reorderThreshold')}
          required
        />
      </label>

      <label>
        Unit Price ($)
        <input
          data-testid="input-unit-price"
          type="number"
          min="0"
          step="0.01"
          value={item.unitPrice}
          onChange={handleChange('unitPrice')}
          required
        />
      </label>

      <label>
        Warehouse Location
        <input
          data-testid="input-location"
          value={item.location}
          onChange={handleChange('location')}
          required
        />
      </label>

      <div className="form-actions">
        <button type="submit" data-testid="submit-item">
          {initialItem ? 'Save Changes' : 'Add Item'}
        </button>
        <button type="button" data-testid="cancel-item" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
