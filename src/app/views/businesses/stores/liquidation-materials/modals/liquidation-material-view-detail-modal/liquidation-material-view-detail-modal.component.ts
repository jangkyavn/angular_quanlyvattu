import { Component, OnInit, Input } from '@angular/core';
import { LiquidationMaterial } from 'src/app/shared/models/liquidation-material.model';
import { LiquidationDetail } from 'src/app/shared/models/liquidation-detail.model';

@Component({
  selector: 'app-liquidation-material-view-detail-modal',
  templateUrl: './liquidation-material-view-detail-modal.component.html',
  styleUrls: ['./liquidation-material-view-detail-modal.component.scss']
})
export class LiquidationMaterialViewDetailModalComponent implements OnInit {
  @Input() liquidationMaterialParams: any;
  liquidationMaterial: LiquidationMaterial;
  liquidationDetails: LiquidationDetail[];
  totalQuantity: number;

  constructor() { }

  ngOnInit() {
    this.liquidationMaterial = this.liquidationMaterialParams.mthanhlyvattu;
    this.liquidationDetails = this.liquidationMaterialParams.listThanhlychitiet;
    this.loadTotalQuantity();
  }

  loadTotalQuantity() {
    this.totalQuantity = 0;

    this.liquidationDetails.forEach((item: LiquidationDetail) => {
      this.totalQuantity += item.soLuongThanhLy;
    });
  }
}
