import { Component, OnInit, Input } from '@angular/core';

import { ExportMaterial } from 'src/app/shared/models/export-material.model';
import { ExportMaterialDetail } from 'src/app/shared/models/export-material-detail.model';

@Component({
  selector: 'app-export-material-view-detail-modal',
  templateUrl: './export-material-view-detail-modal.component.html',
  styleUrls: ['./export-material-view-detail-modal.component.scss']
})
export class ExportMaterialViewDetailModalComponent implements OnInit {
  @Input() exportMaterialParams: any;
  exportMaterial: ExportMaterial;
  exportMaterialDetails: ExportMaterialDetail[];
  totalAmount: number;
  totalAmountAfterDiscount: number;
  discountPrice: number;
  discount: number;

  constructor() { }

  ngOnInit() {
    this.exportMaterial = this.exportMaterialParams.mxuatvattu;
    this.exportMaterialDetails = this.exportMaterialParams.listxuatchitiet;
    this.loadTotalPrice();
  }

  loadTotalPrice() {
    this.totalAmount = 0;
    this.totalAmountAfterDiscount = 0;
    this.discountPrice = 0;

    let idx = 0;
    this.exportMaterialDetails.forEach((item: ExportMaterialDetail) => {
      idx++;
      this.totalAmount += item.soLuongXuat * item.donGia;

      if (this.exportMaterialDetails.length === idx) {
        const { chietKhau } = this.exportMaterial;
        this.discount = chietKhau;
        this.totalAmountAfterDiscount = this.totalAmount * (1 - chietKhau / 100);
        this.discountPrice = this.totalAmount - this.totalAmountAfterDiscount;
      }
    });
  }
}
