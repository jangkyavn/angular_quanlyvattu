import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { InventoryService } from 'src/app/shared/services/inventory.service';
import { Inventory } from 'src/app/shared/models/inventory.model';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {
  inventories: Inventory[];

  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.inventories = data['inventories'];
    });
  }

  loadData() {
    this.inventoryService.getAll().subscribe((res: Inventory[]) => {
      this.inventories = res;
    });
  }
}
