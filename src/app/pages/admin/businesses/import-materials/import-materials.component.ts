import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { MaterialItem } from 'src/app/shared/models/material-item.model';
import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { Material } from 'src/app/shared/models/material.model';
import { ProducingCountry } from 'src/app/shared/models/producing-country.model';
import { Manufacturer } from 'src/app/shared/models/manufacturer.model';

import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { MaterialItemService } from 'src/app/shared/services/material-item.service';
import { MaterialService } from 'src/app/shared/services/material.service';
import { ProducingCountryService } from 'src/app/shared/services/producing-country.service';
import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';
import { ImportMaterialService } from 'src/app/shared/services/import-material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { checkQuantityKhongAmValidator } from 'src/app/shared/vailidators/check-quantity-khong-am.validator';
import { checkChietKhauNanValidator } from 'src/app/shared/vailidators/check-chiet-khau-nan-validator';
import { checkChietKhauRangeValidator } from 'src/app/shared/vailidators/check-chiet-khau-range-validator';
import { checkPriceKhongAmValidator } from 'src/app/shared/vailidators/check-price-khong-am-validator';

@Component({
  selector: 'app-import-materials',
  templateUrl: './import-materials.component.html',
  styleUrls: ['./import-materials.component.scss']
})
export class ImportMaterialsComponent implements OnInit {
  materialStores: MaterialStore[];
  materialItems: MaterialItem[];
  materials: Material[];
  producingCountries: ProducingCountry[];
  manufacturers: Manufacturer[];
  submitted = false;
  importMaterialForm: FormGroup;
  listnhapchitiet: FormArray;
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler($event: any) {
    if (this.importMaterialForm.dirty) {
      $event.returnValue = false;
    }
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private importMaterialService: ImportMaterialService,
    private materialStoreService: MaterialStoreService,
    private materialItemService: MaterialItemService,
    private materialService: MaterialService,
    private producingCountryService: ProducingCountryService,
    private manufacturerService: ManufacturerService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.loadAllInventories();
    this.loadAllMaterialItems();
    this.loadAllMaterials();
    this.loadAllProducingCountries();
    this.loadAllManufacturers();

    this.createForm();
  }

  createForm() {
    const date = new Date();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
    const currentDate = `${date.getFullYear()}-${month}-${date.getDate()}`;

    this.importMaterialForm = this.fb.group({
      mnhapvattu: this.fb.group({
        maKho: ['', [Validators.required]],
        maHM: ['', [Validators.required]],
        ngayNhap: [currentDate, [Validators.required]],
        chietKhau: [0, [checkChietKhauNanValidator, checkChietKhauRangeValidator]],
        ghiChu: [null]
      }),
      listnhapchitiet: this.fb.array([this.createItem()])
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      maVatTu: ['', [Validators.required]],
      soLuong: [1, [Validators.required, checkQuantityKhongAmValidator]],
      donGia: [0, [Validators.required, checkPriceKhongAmValidator]],
      maNuoc: [null],
      maHang: [null],
      model: [null],
      seri: [null],
      soKhung: [null],
      soMay: [null],
      soDangKy: [null],
      dotMua: [null],
      namSX: [null],
      phanCap: [null],
      nguonGoc: [null],
      ghiChu: [null]
    });
  }

  loadAllInventories() {
    this.materialStoreService.getAll().subscribe((res: MaterialStore[]) => {
      this.materialStores = res;
    });
  }

  loadAllMaterialItems() {
    this.materialItemService.getAll().subscribe((res: MaterialItem[]) => {
      this.materialItems = res;
    });
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

  addRowForMaterialDetail() {
    this.listnhapchitiet = this.importMaterialForm.get('listnhapchitiet') as FormArray;
    this.listnhapchitiet.push(this.createItem());
  }

  deleteRow(idx: number) {
    this.listnhapchitiet = this.importMaterialForm.get('listnhapchitiet') as FormArray;
    this.listnhapchitiet.removeAt(idx);
  }

  saveChanges() {
    this.submitted = true;

    if (this.importMaterialForm.invalid) {
      return;
    }

    const nhapVatTuParams = Object.assign({}, this.importMaterialForm.value);
    this.importMaterialService.addNew(nhapVatTuParams).subscribe((res: boolean) => {
      if (res) {
        this.notify.success('Thêm mới thành công!');
        this.router.navigate(['/admin/nghiep-vu/danh-sach-phieu-nhap']);
      } else {
        this.notify.error('Thêm mới thất bại');
      }
    }, error => {
      console.log('error addImportMaterial');
      console.log(error);
    });
  }
}
