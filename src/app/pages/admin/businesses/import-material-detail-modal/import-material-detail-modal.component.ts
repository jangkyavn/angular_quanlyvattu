import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ImportMaterialDetailService } from 'src/app/shared/services/import-material-detail.service';
import { MaterialService } from 'src/app/shared/services/material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { Material } from 'src/app/shared/models/material.model';
import { ProducingCountry } from 'src/app/shared/models/producing-country.model';
import { ProducingCountryService } from 'src/app/shared/services/producing-country.service';
import { Manufacturer } from 'src/app/shared/models/manufacturer.model';
import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';

@Component({
  selector: 'app-import-material-detail-modal',
  templateUrl: './import-material-detail-modal.component.html',
  styleUrls: ['./import-material-detail-modal.component.scss']
})
export class ImportMaterialDetailModalComponent implements OnInit {
  @Input() importMaterialId: number;
  @Input() materialItemId: number;
  materials: Material[];
  producingCountries: ProducingCountry[];
  manufacturers: Manufacturer[];
  importDetailForm: FormGroup;

  formatterPercent = value => `${value} %`;
  parserPercent = value => value.replace(' %', '');

  constructor(
    private fb: FormBuilder,
    private importMaterialDetailService: ImportMaterialDetailService,
    private materialService: MaterialService,
    private producingCountryService: ProducingCountryService,
    private manufacturerService: ManufacturerService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.loadAllMaterials();
    this.loadAllProducingCountries();
    this.loadAllManufacturers();

    this.createForm();
  }

  createForm() {
    switch (this.materialItemId) {
      case 10: // Xe và vật tư thay thế
        this.importDetailForm = this.fb.group({
          maVatTu: [null, [Validators.required]],
          soLuong: [1, [Validators.required]],
          donGia: [0, [Validators.required]],
          maNuoc: [null],
          model: [null]
        });
        break;
      case 11: // Vũ khí trang thiết bị
        this.importDetailForm = this.fb.group({
          maVatTu: [null, [Validators.required]],
          soLuong: [1, [Validators.required]],
          soKhung: [null],
          soMay: [null],
          namSX: [null],
          phanCap: [null],
          nguonGoc: [null]
        });
        break;
      case 12: // Hàng viện trợ Mỹ
        this.importDetailForm = this.fb.group({
          maVatTu: [null, [Validators.required]],
          soLuong: [1, [Validators.required]],
          seri: [null],
          maHang: [null],
          maNuoc: [null],
          model: [null],
          ghiChu: [null]
        });
        break;
      case 13: // Trang thiết bị cục quân y cấp
        this.importDetailForm = this.fb.group({
          maVatTu: [null, [Validators.required]],
          soLuong: [1, [Validators.required]],
          donGia: [0, [Validators.required]],
          maNuoc: [null],
          model: [null]
        });
        break;
      case 14: // Hàng tài trợ trong nước
        this.importDetailForm = this.fb.group({
          maVatTu: [null, [Validators.required]],
          soLuong: [1, [Validators.required]],
          donGia: [0, [Validators.required]],
          maNuoc: [null],
          model: [null]
        });
        break;
      case 15: // Danh mục thể thao văn hóa
        this.importDetailForm = this.fb.group({
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
  }

  loadAllMaterials() {
    this.materialService.getAll().subscribe((res: Material[]) => {
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

  saveChanges(callBack: (result: boolean) => any = null) {
    if (this.importDetailForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.importDetailForm.controls) {
        this.importDetailForm.controls[i].markAsDirty();
        this.importDetailForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const importDetail = Object.assign({}, this.importDetailForm.value);
    const importDetailParams = {
      importDetail,
      importId: this.importMaterialId
    };
    this.importMaterialDetailService.addNew(importDetailParams).subscribe((res: any) => {
      if (res) {
        this.notify.success('Thêm thành công!');
        callBack(true);
      }
    }, error => {
      this.notify.success('Có lỗi xảy ra!');
      console.log('error addImportDetail');
      callBack(false);
    });
  }
}
