import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { MaterialItem } from 'src/app/shared/models/material-item.model';
import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { Material } from 'src/app/shared/models/material.model';
import { ProducingCountry } from 'src/app/shared/models/producing-country.model';
import { Manufacturer } from 'src/app/shared/models/manufacturer.model';
import { ImportMaterial } from 'src/app/shared/models/import-material.model';
import { ImportMaterialDetail } from 'src/app/shared/models/import-material-detail.model';

import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { MaterialItemService } from 'src/app/shared/services/material-item.service';
import { MaterialService } from 'src/app/shared/services/material.service';
import { ProducingCountryService } from 'src/app/shared/services/producing-country.service';
import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';
import { ImportMaterialService } from 'src/app/shared/services/import-material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-import-edit-modal',
  templateUrl: './import-edit-modal.component.html',
  styleUrls: ['./import-edit-modal.component.scss']
})
export class ImportEditModalComponent implements OnInit, AfterViewInit {
  @Output() saveEntity = new EventEmitter<boolean>();
  title: string;
  materialStores: MaterialStore[];
  materialItems: MaterialItem[];
  materials: Material[];
  producingCountries: ProducingCountry[];
  manufacturers: Manufacturer[];
  nhapVatTuParams: any;

  importMaterialForm: FormGroup;
  listnhapchitiet: FormArray;
  listDelete: any[] = [];

  constructor(
    public bsModalRef: BsModalRef,
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

  ngAfterViewInit() {
    this.importMaterialForm.patchValue({
      mnhapvattu: this.nhapVatTuParams.mnhapvattu,
      listnhapchitiet: [
        {maPhieuNhap: 1, maVatTu: 26, soLuong: 2, donGia: 20000},
        {maPhieuNhap: 1, maVatTu: 28, soLuong: 3, donGia: 10000}
      ]
    });
    console.log(this.nhapVatTuParams);

    console.log(this.nhapVatTuParams.listnhapchitiet.length);
    console.log((this.importMaterialForm.get('listnhapchitiet') as FormArray).length);
  }

  createForm() {
    this.importMaterialForm = this.fb.group({
      mnhapvattu: this.fb.group({
        maKho: [{ value: null, disabled: true }, [Validators.required]],
        maHM: [null, [Validators.required]],
        ngayNhap: [null, [Validators.required]],
        chietKhau: [null],
        ghiChu: [null]
      }),
      listnhapchitiet: this.fb.array([this.createItem()])
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      maVatTu: [{ value: null, disabled: true }, [Validators.required]],
      soLuong: [null, [Validators.required]],
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

  createItem1(): FormGroup {
    return this.fb.group({
      maVatTu: [null, [Validators.required]],
      soLuong: [null, [Validators.required]],
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

  saveChanges() {
    const nhapVatTuParams = Object.assign({}, this.importMaterialForm.value);
    this.importMaterialService.update(nhapVatTuParams).subscribe((res: number) => {
      if (res === 1) {
        this.notify.success('Sửa thành công!');
        this.saveEntity.emit(true);
        this.bsModalRef.hide();
      } else if (res === -1) {
        this.notify.error('Số lượng tồn kho đã bị âm!');
        this.saveEntity.emit(false);
        this.bsModalRef.hide();
      } else {
        this.notify.error('Có lỗi!');
        this.saveEntity.emit(false);
        this.bsModalRef.hide();
      }
    }, error => {
      this.saveEntity.emit(false);
      this.notify.success('Có lỗi xảy ra!');
      console.log('error updateImportMaterial');
    }, () => {
      for (const item of this.listDelete) {
        this.importMaterialService.deleteImportDetail(item.maPhieuNhap, item.maVatTu, item.maKho)
          .subscribe((res: boolean) => { });
      }
    });
  }

  addRowForMaterialDetail() {
    this.listnhapchitiet = this.importMaterialForm.get('listnhapchitiet') as FormArray;
    this.listnhapchitiet.push(this.createItem1());
  }

  deleteRow(idx: number, maVatTu: any) {
    this.listnhapchitiet = this.importMaterialForm.get('listnhapchitiet') as FormArray;
    this.listnhapchitiet.removeAt(idx);
    const { maPhieuNhap, maKho } = this.nhapVatTuParams.mnhapvattu;

    this.listDelete.push({
      maPhieuNhap,
      maKho,
      maVatTu
    });
  }

  hideModal() {
    // if (importMaterialForm.dirty) {
    //   const result = confirm('Bạn có chắc chắn muốn tiếp tục không? Mọi sự thay đổi không lưu sẽ bị mất');
    //   if (result) {
    //     this.bsModalRef.hide();
    //   }
    // } else {
    //   this.bsModalRef.hide();
    // }
  }
}
