import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { InventoryService } from 'src/app/shared/services/inventory.service';
import { MaterialService } from 'src/app/shared/services/material.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  totalUsers: number;
  totalMaterials: number;
  totalInventories: number;

  constructor(
    private userService: UserService,
    private materialService: MaterialService,
    private inventoryService: InventoryService
  ) { }

  ngOnInit() {
    this.getTotal();
  }

  getTotal() {
    this.userService.getTotalCount().subscribe((res: number) => {
      this.totalUsers = res;
    });

    this.materialService.getTotalCount().subscribe((res: number) => {
      this.totalMaterials = res;
    });

    this.inventoryService.getTotalCount().subscribe((res: number) => {
      this.totalInventories = res;
    });
  }
}
