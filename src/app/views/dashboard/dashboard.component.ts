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
  loadingTotalUsers: boolean;
  loadingTotalMaterials: boolean;
  loadingTotalInventories: boolean;

  totalUsers: any;
  totalMaterials: any;
  totalInventories: any;

  constructor(private userService: UserService,
    private materialService: MaterialService,
    private inventoryService: InventoryService) { }

  ngOnInit() {
    this.getTotal();
  }

  getTotal() {
    this.getTotalUsers();
    this.getTotalMaterials();
    this.getTotalInventories();
  }

  getTotalUsers() {
    this.loadingTotalUsers = true;
    this.userService.getTotalCount()
      .subscribe((res: any) => {
        this.totalUsers = res;
        this.loadingTotalUsers = false;
      });
  }

  getTotalMaterials() {
    this.loadingTotalMaterials = true;
    this.materialService.getTotalCount()
      .subscribe((res: any) => {
        this.totalMaterials = res;
        this.loadingTotalMaterials = false;
      });
  }

  getTotalInventories() {
    this.loadingTotalInventories = true;
    this.inventoryService.getTotalCount()
      .subscribe((res: any) => {
        this.totalInventories = res;
        this.loadingTotalInventories = false;
      });
  }
}
