import { Component, OnInit, Input } from '@angular/core';

import { ImportMaterial } from 'src/app/shared/models/import-material.model';
import { ImportMaterialDetail } from 'src/app/shared/models/import-material-detail.model';

@Component({
  selector: 'app-import-material-view-detail-modal',
  templateUrl: './import-material-view-detail-modal.component.html',
  styleUrls: ['./import-material-view-detail-modal.component.scss']
})
export class ImportMaterialViewDetailModalComponent implements OnInit {
  @Input() importMaterialParams: any;
  importMaterial: ImportMaterial;
  importMaterialDetails: ImportMaterialDetail[];
  totalAmount: number;
  totalAmountAfterDiscount: number;
  discountPrice: number;
  discount: number;

  constructor() { }

  ngOnInit() {
    this.importMaterial = this.importMaterialParams.mnhapvattu;
    this.importMaterialDetails = this.importMaterialParams.listnhapchitiet;
    this.loadTotalPrice();
  }

  loadTotalPrice() {
    this.totalAmount = 0;
    this.totalAmountAfterDiscount = 0;
    this.discountPrice = 0;

    let idx = 0;
    this.importMaterialDetails.forEach((item: ImportMaterialDetail) => {
      idx++;
      this.totalAmount += item.soLuong * item.donGia;

      if (this.importMaterialDetails.length === idx) {
        const { chietKhau } = this.importMaterial;
        this.discount = chietKhau;
        this.totalAmountAfterDiscount = this.totalAmount * (1 - chietKhau / 100);
        this.discountPrice = this.totalAmount - this.totalAmountAfterDiscount;
      }
    });
  }
}
