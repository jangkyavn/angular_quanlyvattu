import { Component, OnInit, Input } from '@angular/core';
import { InventoryMaterial } from 'src/app/shared/models/inventory-material.model';
import { InventoryMaterialDetail } from 'src/app/shared/models/inventory-material-detail.model';

@Component({
// tslint:disable-next-line: component-selector
  selector: 'app-inventoryMaterialViewDetailModal',
  templateUrl: './inventoryMaterialViewDetailModal.component.html',
  styleUrls: ['./inventoryMaterialViewDetailModal.component.scss']
})
export class InventoryMaterialViewDetailModalComponent implements OnInit {
@Input() InventoryMaterialParams: any;
InventoryMaterial: InventoryMaterial;
InventoryMaterialDetail: InventoryMaterialDetail[];
  totalQuantity: number;

  constructor() { }

  ngOnInit() {
    console.log(this.InventoryMaterialParams);
    
    this.InventoryMaterial = this.InventoryMaterialParams.mKiemKeVatTu;
    this.InventoryMaterialDetail = this.InventoryMaterialParams.listKiemKeChiTiet;
    this.loadTotalQuantity();
  }

  loadTotalQuantity() {
    this.totalQuantity = 0;

    // this.InventoryMaterialDetail.forEach((item: InventoryMaterialDetail) => {
    //   this.totalQuantity += item.soLuongThanhLy;
    // });
  }
}
