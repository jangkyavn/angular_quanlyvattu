import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
    this.importMaterialForm = this.fb.group({
      mnhapvattu: this.fb.group({
        maKho: [null, [Validators.required]],
        maHM: [null, [Validators.required]],
        ngayNhap: [null, [Validators.required]],
        chietKhau: [0],
        ghiChu: [null]
      }),
      listnhapchitiet: this.fb.array([this.createItem()])
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      maVatTu: [null, [Validators.required]],
      soLuong: [1, [Validators.required]],
      donGia: [null, [Validators.required]],
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
