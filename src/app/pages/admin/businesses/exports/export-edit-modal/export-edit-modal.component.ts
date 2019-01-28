import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { Personnel } from 'src/app/shared/models/personnel.model';
import { Material } from 'src/app/shared/models/material.model';

import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { PersonnelService } from 'src/app/shared/services/personnel.service';
import { MaterialService } from 'src/app/shared/services/material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { ExportMaterialService } from 'src/app/shared/services/export-material.service';

@Component({
  selector: 'app-export-edit-modal',
  templateUrl: './export-edit-modal.component.html',
  styleUrls: ['./export-edit-modal.component.scss']
})
export class ExportEditModalComponent implements OnInit, AfterViewInit {
  @Output() saveEntity = new EventEmitter<boolean>();
  title: string;
  materialStores: MaterialStore[];
  personnels: Personnel[];
  materials: Material[];
  importMaterials: number[];

  exportMaterialForm: FormGroup;
  listxuatchitiet: FormArray;
  xuatVatTuParams: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private materialStoreService: MaterialStoreService,
    private personnelService: PersonnelService,
    private materialService: MaterialService,
    public exportMaterialService: ExportMaterialService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.loadAllMaterialStores();
    this.loadAllPersonnels();
    this.loadAllMaterials();

    this.createForm();
  }

  ngAfterViewInit() {
    this.exportMaterialForm.patchValue(this.xuatVatTuParams);

    this.loadImportMaterialsByStoreId(this.xuatVatTuParams.mxuatvattu.maKho);
    for (let i = 0; i < this.xuatVatTuParams.listxuatchitiet.length; i++) {
      this.loadMaterialByImportId(this.xuatVatTuParams.listxuatchitiet[i].maPhieuNhap, i);
    }
  }

  createForm() {
    this.exportMaterialForm = this.fb.group({
      mxuatvattu: this.fb.group({
        maKho: [{ value: null, disabled: true }, [Validators.required]],
        maNS: [null, [Validators.required]],
        ngayNhap: [null, [Validators.required]],
        ghiChu: [null]
      }),
      listxuatchitiet: this.fb.array([this.createItem()])
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      maPhieuNhap: [{ value: null, disabled: true }, [Validators.required]],
      maVatTu: [{ value: null, disabled: true }, [Validators.required]],
      soLuongXuat: [null, [Validators.required]],
      donGia: [null, [Validators.required]],
      ghiChu: [null],
      materials: [[]]
    });
  }

  loadAllMaterialStores() {
    this.materialStoreService.getAll().subscribe((res: MaterialStore[]) => {
      this.materialStores = res;
    });
  }

  loadAllPersonnels() {
    this.personnelService.getAll().subscribe((res: Personnel[]) => {
      this.personnels = res;
    });
  }

  loadAllMaterials() {
    this.materialService.getAll().subscribe((res: Material[]) => {
      this.materials = res;
    });
  }

  loadImportMaterialsByStoreId(storeId: number) {
    this.exportMaterialService.getImportsByStoreId(storeId).subscribe((res: number[]) => {
      this.importMaterials = res;
    });
  }

  loadMaterialByImportId(importId: number, idx: number) {
    this.exportMaterialService.getMaterialsByImportId(importId).subscribe((res: any) => {
      const lstControl = (<FormArray>this.exportMaterialForm.controls['listxuatchitiet']).at(idx);
      lstControl['controls'].materials.setValue([...res]);
    });
  }

  addRowForMaterialDetail() {
    ///////////////
  }

  saveChanges() {
    const nhapVatTuParams = Object.assign({}, this.exportMaterialForm.value);
    this.exportMaterialService.update(nhapVatTuParams).subscribe((res: number) => {
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
      console.log('error updateExportMaterial');
    });
  }

  hideModal() {
    // if (exportMaterialForm.dirty) {
    //   const result = confirm('Bạn có chắc chắn muốn tiếp tục không? Mọi sự thay đổi không lưu sẽ bị mất');
    //   if (result) {
    //     this.bsModalRef.hide();
    //   }
    // } else {
    //   this.bsModalRef.hide();
    // }
  }
}
