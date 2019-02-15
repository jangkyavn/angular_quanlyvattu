import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ImportMaterialDetailService } from 'src/app/shared/services/import-material-detail.service';
import { MaterialService } from 'src/app/shared/services/material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';
import { ProducingCountryService } from 'src/app/shared/services/producing-country.service';

import { Material } from 'src/app/shared/models/material.model';
import { ProducingCountry } from 'src/app/shared/models/producing-country.model';
import { Manufacturer } from 'src/app/shared/models/manufacturer.model';
import { Supply } from 'src/app/shared/models/supply.model';
import { SupplyService } from 'src/app/shared/services/supply.service';
import { ImportMaterialDetail } from 'src/app/shared/models/import-material-detail.model';
import { checkImportQuantityValidator } from 'src/app/shared/vailidators/check-import-quantity-validator';
import { ImportMaterialService } from 'src/app/shared/services/import-material.service';

@Component({
  selector: 'app-import-material-detail-modal',
  templateUrl: './import-material-detail-modal.component.html',
  styleUrls: ['./import-material-detail-modal.component.scss']
})
export class ImportMaterialDetailModalComponent implements OnInit {
  @Input() importMaterialId: number;
  @Input() materialItemId: number;
  @Input() materialStoreId: number;
  @Input() importDetail: ImportMaterialDetail;
  @Input() isAddNew: boolean;
  materials: Material[];
  producingCountries: ProducingCountry[];
  manufacturers: Manufacturer[];
  supplies: Supply[];
  importDetailForm: FormGroup;

  formatterPercent = value => `${value} %`;
  parserPercent = value => value.replace(' %', '');

  constructor(
    private fb: FormBuilder,
    private importMaterialService: ImportMaterialService,
    private importMaterialDetailService: ImportMaterialDetailService,
    private materialService: MaterialService,
    private producingCountryService: ProducingCountryService,
    private manufacturerService: ManufacturerService,
    private supplyService: SupplyService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.loadAllMaterialByItemId(this.materialItemId);
    this.loadAllProducingCountries();
    this.loadAllManufacturers();
    this.loadAllSupply();

    this.createForm();
  }

  createForm() {
    switch (this.materialItemId) {
      case 10: // Xe và vật tư thay thế
        this.importDetailForm = this.fb.group({
          maPhieuNhap: [null],
          maVatTu: [null, [Validators.required]],
          soLuong: [1, [Validators.required]],
          donGia: [0, [Validators.required]],
          maNuoc: [null],
          model: [null]
        });
        break;
      case 11: // Vũ khí trang thiết bị
        this.importDetailForm = this.fb.group({
          maPhieuNhap: [null],
          maVatTu: [null, [Validators.required]],
          soLuong: [1, [Validators.required]],
          donGia: [0, [Validators.required]],
          soKhung: [null],
          soMay: [null],
          namSX: [null],
          phanCap: [null],
          maNguon: [null]
        });
        break;
      case 12: // Hàng viện trợ Mỹ
        this.importDetailForm = this.fb.group({
          maPhieuNhap: [null],
          maVatTu: [null, [Validators.required]],
          soLuong: [1, [Validators.required]],
          donGia: [0, [Validators.required]],
          seri: [null],
          maHang: [null],
          maNuoc: [null],
          model: [null],
          ghiChu: [null]
        });
        break;
      case 13: // Trang thiết bị cục quân y cấp
        this.importDetailForm = this.fb.group({
          maPhieuNhap: [null],
          maVatTu: [null, [Validators.required]],
          soLuong: [1, [Validators.required]],
          donGia: [0, [Validators.required]],
          maNuoc: [null],
          model: [null]
        });
        break;
      case 14: // Hàng tài trợ trong nước
        this.importDetailForm = this.fb.group({
          maPhieuNhap: [null],
          maVatTu: [null, [Validators.required]],
          soLuong: [1, [Validators.required]],
          donGia: [0, [Validators.required]],
          maNuoc: [null],
          model: [null]
        });
        break;
      case 15: // Danh mục thể thao văn hóa
        this.importDetailForm = this.fb.group({
          maPhieuNhap: [null],
          maVatTu: [null, [Validators.required]],
          soLuong: [1, [Validators.required]],
          donGia: [0, [Validators.required]],
          maHang: [null],
          maNuoc: [null],
          model: [null]
        });
        break;
      case 16: // Danh mục thuốc
        this.importDetailForm = this.fb.group({
          maPhieuNhap: [null],
          maVatTu: [null, [Validators.required]],
          soLuong: [1, [Validators.required]],
          donGia: [0, [Validators.required]],
          maNuoc: [null],
          soDangKy: [null],
          dotMua: [null]
        });
        break;
      default:
        break;
    }

    this.importDetailForm.patchValue(this.importDetail);
  }

  loadAllMaterialByItemId(materialItemId: number) {
    this.materialService.getAllByItemId(materialItemId)
      .subscribe((res: Material[]) => {
        this.materials = res;
      });
  }

  loadAllProducingCountries() {
    this.producingCountryService.getAll().subscribe((res: ProducingCountry[]) => {
      this.producingCountries = res;
    });
  }

  loadAllManufacturers() {
    this.manufacturerService.getAll().subscribe((res: Manufacturer[]) => {
      this.manufacturers = res;
    });
  }

  loadAllSupply() {
    this.supplyService.getAll().subscribe((res: Supply[]) => {
      this.supplies = res;
    });
  }

  saveChanges(callBack: (result: boolean) => any = null) {
    if (this.importDetailForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.importDetailForm.controls) {
        this.importDetailForm.controls[i].markAsDirty();
        this.importDetailForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const importDetail: ImportMaterialDetail = Object.assign({}, this.importDetailForm.value);
    const importDetailParams = {
      importDetail,
      importId: this.importMaterialId,
      storeId: this.materialStoreId
    };

    if (this.isAddNew) {
      this.importMaterialDetailService.checkDuplicate(importDetail.maPhieuNhap, importDetail.maVatTu)
        .subscribe((check: number) => {
          if (check !== -1) {
            importDetailParams.importDetail.soLuong += check;
            this.importMaterialDetailService.update(importDetailParams)
              .subscribe((res: any) => {
                if (res >= 0) {
                  this.notify.success('Sửa thành công!');
                  callBack(true);
                }
              }, error => {
                this.notify.error('Có lỗi xảy ra!');
                console.log('error updateImportDetail');
                callBack(false);
              });
          } else {
            this.importMaterialDetailService.addNew(importDetailParams)
              .subscribe((res: any) => {
                if (res) {
                  this.notify.success('Thêm thành công!');
                  callBack(true);
                }
              }, error => {
                this.notify.error('Có lỗi xảy ra!');
                console.log('error addImportDetail');
                callBack(false);
              });
          }
        });
    } else {
      this.importMaterialDetailService.update(importDetailParams)
        .subscribe((res: any) => {
          if (res >= 0) {
            this.notify.success('Sửa thành công!');
            callBack(true);
          }
        }, error => {
          this.notify.error('Có lỗi xảy ra!');
          console.log('error updateImportDetail');
          callBack(false);
        });
    }
  }

  checkQuantity(value) {
    if (!this.isAddNew) {
      const { maPhieuNhap, maVatTu } = this.importDetailForm.value;
      const maKho = this.materialStoreId;
      const soLuongControl = this.importDetailForm.get(`soLuong`);
      soLuongControl.setAsyncValidators(checkImportQuantityValidator(this.importMaterialService,
        maPhieuNhap, maKho, maVatTu, value));
      soLuongControl.updateValueAndValidity();
    }
  }

  blurPrice(event: any) {
    if (event.target.value.indexOf('-') > -1) {
      const donGiaControl = this.importDetailForm.get(`donGia`);
      donGiaControl.setValue(0);
    }
  }
}
