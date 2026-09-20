package com.inventory.service;

import com.inventory.exception.DuplicateSkuException;
import com.inventory.exception.ItemNotFoundException;
import com.inventory.model.InventoryItem;
import com.inventory.repository.InventoryItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryItemService {

    private final InventoryItemRepository repository;

    public InventoryItemService(InventoryItemRepository repository) {
        this.repository = repository;
    }

    public List<InventoryItem> findAll() {
        return repository.findAll();
    }

    public InventoryItem findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException(id));
    }

    public InventoryItem create(InventoryItem item) {
        if (repository.existsBySku(item.getSku())) {
            throw new DuplicateSkuException(item.getSku());
        }
        item.setId(null);
        return repository.save(item);
    }

    public InventoryItem update(Long id, InventoryItem updated) {
        InventoryItem existing = findById(id);

        // If the SKU is changing, make sure it doesn't collide with another item.
        if (!existing.getSku().equals(updated.getSku()) && repository.existsBySku(updated.getSku())) {
            throw new DuplicateSkuException(updated.getSku());
        }

        existing.setSku(updated.getSku());
        existing.setName(updated.getName());
        existing.setCategory(updated.getCategory());
        existing.setQuantity(updated.getQuantity());
        existing.setReorderThreshold(updated.getReorderThreshold());
        existing.setUnitPrice(updated.getUnitPrice());
        existing.setLocation(updated.getLocation());

        return repository.save(existing);
    }

    public void delete(Long id) {
        InventoryItem existing = findById(id);
        repository.delete(existing);
    }

    public List<InventoryItem> findLowStock() {
        return repository.findLowStockItems();
    }

    public List<InventoryItem> search(String query) {
        if (query == null || query.isBlank()) {
            return repository.findAll();
        }
        return repository.search(query);
    }
}
