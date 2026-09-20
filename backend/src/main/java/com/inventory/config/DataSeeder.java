package com.inventory.config;

import com.inventory.model.InventoryItem;
import com.inventory.repository.InventoryItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @org.springframework.context.annotation.Bean
    public CommandLineRunner seedData(InventoryItemRepository repository) {
        return args -> {
            repository.save(new InventoryItem("SKU-1001", "Cardboard Box (Medium)", "Packaging", 450, 100, 0.85, "A-01-3"));
            repository.save(new InventoryItem("SKU-1002", "Pallet Wrap Roll", "Packaging", 30, 40, 12.50, "A-02-1"));
            repository.save(new InventoryItem("SKU-2001", "Forklift Battery Pack", "Equipment", 4, 2, 850.00, "B-05-1"));
            repository.save(new InventoryItem("SKU-2002", "Safety Vest (Hi-Vis, L)", "Safety", 85, 20, 9.99, "B-01-2"));
            repository.save(new InventoryItem("SKU-3001", "Barcode Scanner", "Equipment", 12, 5, 145.00, "C-03-4"));
            repository.save(new InventoryItem("SKU-3002", "Shipping Label Roll", "Packaging", 8, 15, 6.75, "A-02-2"));
            repository.save(new InventoryItem("SKU-4001", "Pallet Jack", "Equipment", 6, 3, 320.00, "B-05-2"));
        };
    }
}
