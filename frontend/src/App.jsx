import { useState, useEffect, useCallback } from 'react';
import { inventoryApi } from './api/inventoryApi';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';
import SearchBar from './components/SearchBar';
import StatCards from './components/StatCards';
import './App.css';

export default function App() {
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]); // unfiltered, for dashboard stats
  const [searchQuery, setSearchQuery] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [loadError, setLoadError] = useState('');

  const loadItems = useCallback(async () => {
    try {
      setLoadError('');
      const [data, everything] = await Promise.all([
        lowStockOnly ? inventoryApi.getLowStock() : inventoryApi.getAll(searchQuery),
        inventoryApi.getAll(),
      ]);
      setItems(data);
      setAllItems(everything);
    } catch (err) {
      setLoadError('Could not load inventory items. Is the backend running on port 8080?');
    }
  }, [searchQuery, lowStockOnly]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleAddClick = () => {
    setEditingItem(null);
    setFormError('');
    setShowForm(true);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormError('');
    setShowForm(true);
  };

  const handleDeleteClick = async (item) => {
    if (!window.confirm(`Delete "${item.name}" (${item.sku})?`)) return;
    await inventoryApi.remove(item.id);
    await loadItems();
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingItem) {
        await inventoryApi.update(editingItem.id, formData);
      } else {
        await inventoryApi.create(formData);
      }
      setShowForm(false);
      setEditingItem(null);
      await loadItems();
    } catch (err) {
      const message = err.response?.data?.error || 'Something went wrong saving this item.';
      setFormError(message);
    }
  };

  return (
    <div className="app">
      <div className="app-background" />
      <header className="app-header">
        <div>
          <h1>Warehouse Inventory</h1>
          <p className="app-subtitle">Real-time stock tracking &amp; reorder alerts</p>
        </div>
        <button className="add-item-btn" data-testid="add-item-button" onClick={handleAddClick}>
          + Add Item
        </button>
      </header>

      <StatCards items={allItems} />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        lowStockOnly={lowStockOnly}
        onLowStockToggle={setLowStockOnly}
      />

      {loadError && <div className="load-error" data-testid="load-error">{loadError}</div>}

      {showForm && (
        <div className="form-overlay">
          <ItemForm
            initialItem={editingItem}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
            error={formError}
          />
        </div>
      )}

      <ItemList items={items} onEdit={handleEditClick} onDelete={handleDeleteClick} />
    </div>
  );
}
