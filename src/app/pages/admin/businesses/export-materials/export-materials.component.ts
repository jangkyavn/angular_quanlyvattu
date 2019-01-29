import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { Personnel } from 'src/app/shared/models/personnel.model';
import { Material } from 'src/app/shared/models/material.model';

import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { PersonnelService } from 'src/app/shared/services/personnel.service';
import { MaterialService } from 'src/app/shared/services/material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { ExportMaterialService } from 'src/app/shared/services/export-material.service';

@Component({
  selector: 'app-export-materials',
  templateUrl: './export-materials.component.html',
  styleUrls: ['./export-materials.component.scss']
})
export class ExportMaterialsComponent implements OnInit {
  materialStores: MaterialStore[];
  personnels: Personnel[];
  materials: Material[];
  importMaterials: number[];
  submitted = false;
  exportMaterialForm: FormGroup;
  listxuatchitiet: FormArray;
  isShowMaterials = false;
  isShowImports = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private materialStoreService: MaterialStoreService,
    private personnelService: PersonnelService,
    private materialService: MaterialService,
    private exportMaterialService: ExportMaterialService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.loadAllMaterialStores();
    this.loadAllPersonnels();

    this.createForm();
  }

  createForm() {
    const date = new Date();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
    const currentDate = `${date.getFullYear()}-${month}-${date.getDate()}`;

    this.exportMaterialForm = this.fb.group({
      mxuatvattu: this.fb.group({
        maKho: ['', [Validators.required]],
        maNS: ['', [Validators.required]],
        ngayNhap: [currentDate, [Validators.required]],
        ghiChu: [null]
      }),
      listxuatchitiet: this.fb.array([this.createItem()])
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      maPhieuNhap: ['', [Validators.required]],
      maVatTu: ['', [Validators.required]],
      soLuongXuat: [1, [Validators.required]],
      donGia: [null, [Validators.required]],
      ghiChu: [null],
      importIds: [[]]
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

  saveChanges() {
    this.submitted = true;

    if (this.exportMaterialForm.invalid) {
      return;
    }

    const xuatVatTuParams = Object.assign({}, this.exportMaterialForm.value);
    this.exportMaterialService.addNew(xuatVatTuParams).subscribe((res: number) => {
      console.log(res);
      if (res === 1) {
        this.notify.success('Thêm mới thành công!');
        this.router.navigate(['/admin/nghiep-vu/danh-sach-phieu-xuat']);
      } else if (res === -1) {
        this.notify.error('Số lượng xuất vượt quá');
      } else {
        this.notify.error('Có lỗi xảy ra');
      }
    }, error => {
      console.log('error addExportMaterial');
      console.log(error);
    });
  }

  addRowForMaterialDetail() {
    this.listxuatchitiet = this.exportMaterialForm.get('listxuatchitiet') as FormArray;
    this.listxuatchitiet.push(this.createItem());
  }

  deleteRow(idx: number) {
    this.listxuatchitiet = this.exportMaterialForm.get('listxuatchitiet') as FormArray;
    this.listxuatchitiet.removeAt(idx);
  }

  changeMaterialStore(storeId: number) {
    this.exportMaterialService.getMaterialsByStoreId(storeId).subscribe((res: Material[]) => {
      this.materials = res;
    });

    this.isShowMaterials = true;
  }

  changeMaterials(materialId: number, idx: number) {
    this.exportMaterialService.getImportsByMaterialId(materialId).subscribe((res: any[]) => {
      const importIds = res.map((item) => {
        return item.maPhieuNhap;
      });

      const lstControl = (<FormArray>this.exportMaterialForm.controls['listxuatchitiet']).at(idx);
      lstControl['controls'].importIds.setValue([...importIds]);
    });

    this.isShowImports = true;
  }
}
