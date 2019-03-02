import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { InventoryService } from 'src/app/shared/services/inventory.service';
import { MaterialService } from 'src/app/shared/services/material.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalUsers$: Observable<any>;
  totalMaterials$: Observable<any>;
  totalInventories$: Observable<any>;

  constructor(private userService: UserService,
    private materialService: MaterialService,
    private inventoryService: InventoryService) { }

  ngOnInit() {
    this.getTotal();
  }

  getTotal() {
    this.totalUsers$ = this.userService.getTotalCount();
    this.totalMaterials$ = this.materialService.getTotalCount();
    this.totalInventories$ = this.inventoryService.getTotalCount();
  }
}
