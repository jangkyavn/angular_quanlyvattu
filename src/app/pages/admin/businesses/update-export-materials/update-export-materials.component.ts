import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { Personnel } from 'src/app/shared/models/personnel.model';
import { Material } from 'src/app/shared/models/material.model';
import { ExportMaterial } from 'src/app/shared/models/export-material.model';

import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { PersonnelService } from 'src/app/shared/services/personnel.service';
import { MaterialService } from 'src/app/shared/services/material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { ExportMaterialService } from 'src/app/shared/services/export-material.service';
import { ExportMaterialDetail } from 'src/app/shared/models/export-material-detail.model';
import { checkPriceKhongAmValidator } from 'src/app/shared/vailidators/check-price-khong-am-validator';
import { checkExportQuantityValidator } from 'src/app/shared/vailidators/check-export-quantity-validator';

@Component({
  selector: 'app-update-export-materials',
  templateUrl: './update-export-materials.component.html',
  styleUrls: ['./update-export-materials.component.scss']
})
export class UpdateExportMaterialsComponent implements OnInit {
  materialStores: MaterialStore[];
  personnels: Personnel[];
  materials: Material[];
  importMaterials: number[];
  submitted = false;
  exportMaterialForm: FormGroup;
  listxuatchitiet: FormArray;
  listDelete: any[] = [];
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler($event: any) {
    if (this.exportMaterialForm.dirty) {
      $event.returnValue = false;
    }
  }

  constructor(
    private route: ActivatedRoute,
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
    this.loadAllMaterials();
    this.materials = [];
    this.createForm();
  }

  createForm() {
    this.exportMaterialForm = this.fb.group({
      mxuatvattu: this.fb.group({}),
      listxuatchitiet: this.fb.array([])
    });

    this.route.data.subscribe(data => {
      const { mxuatvattu, listxuatchitiet } = data['export-material'];
      const formArray = this.exportMaterialForm.get('listxuatchitiet') as FormArray;

      listxuatchitiet.map(item => {
        formArray.push(this.createItem(item));
      });

      this.exportMaterialForm.setControl('mxuatvattu', this.createGroup(mxuatvattu));
      this.exportMaterialForm.setControl('listxuatchitiet', formArray);

      this.loadMaterialsByStoreId(mxuatvattu.maKho);
      for (let i = 0; i < listxuatchitiet.length; i++) {
        this.loadImportsByMaterialId(listxuatchitiet[i].maVatTu, i);
      }
    });
  }

  createGroup(item: ExportMaterial): FormGroup {
    return this.fb.group({
      maPhieuXuat: [item.maPhieuXuat],
      maKho: [{ value: item.maKho, disabled: false }, [Validators.required]],
      maNS: [item.maNS, [Validators.required]],
      ngayNhap: [item.ngayNhap, [Validators.required]],
      ghiChu: [item.ghiChu]
    });
  }

  createItem(item: ExportMaterialDetail): FormGroup {
    return this.fb.group({
      maPhieuXuat: [item.maPhieuXuat],
      maPhieuNhap: [{ value: item.maPhieuNhap, disabled: false }, [Validators.required]],
      maVatTu: [{ value: item.maVatTu, disabled: false }, [Validators.required]],
      tenVT: [item.tenVT],
      soLuongXuat: [item.soLuongXuat, [Validators.required]],
      donGia: [item.donGia, [Validators.required, checkPriceKhongAmValidator]],
      ghiChu: [item.ghiChu],
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

  loadAllMaterials() {
    this.materialService.getAll().subscribe((res: Material[]) => {
      this.materials = res;
    });
  }

  getStoreName() {
    if (this.materialStores) {
      const maKho = this.exportMaterialForm.get('mxuatvattu.maKho').value;
      return this.materialStores.filter(x => x.maKho === maKho).map(x => x.tenKho);
    }
  }

  loadMaterialsByStoreId(storeId: number) {
    this.exportMaterialService.getMaterialsByImportId(storeId).subscribe((res: Material[]) => {
      this.materials = res;
    });
  }

  loadImportsByMaterialId(materialId: number, idx: number) {
    this.exportMaterialService.getImportsByMaterialId(materialId).subscribe((res: any[]) => {
      const importIds = res.map((item) => {
        return item.maPhieuNhap;
      });

      const lstControl = (<FormArray>this.exportMaterialForm.controls['listxuatchitiet']).at(idx);
      lstControl['controls'].importIds.setValue([...importIds]);
    });
  }

  saveChanges() {
    this.submitted = true;

    if (this.exportMaterialForm.invalid) {
      return;
    }

    const xuatVatTuParams = Object.assign({}, this.exportMaterialForm.value);

    if (this.listDelete.length > 0) {
      const requestDelete = this.listDelete.map((item, idx) => {
        ++idx;
        this.exportMaterialService.deleteExportDetails(item.maPhieuXuat, item.maPhieuNhap, item.maVatTu, item.maKho)
          .subscribe((res: boolean) => {
            console.log(res);
          }, err => {
            console.log('error DeleteExportDetails');
            console.log(err);
          }, () => {
            if (idx === this.listDelete.length) {
              this.exportMaterialService.update(xuatVatTuParams).subscribe((res: number) => {
                if (res === 1) {
                  this.notify.success('Sửa thành công!');
                  this.router.navigate(['/admin/nghiep-vu/danh-sach-phieu-xuat']);
                } else if (res === -1) {
                  this.notify.error('Số lượng xuất vượt quá');
                } else {
                  this.notify.error('Có lỗi xảy ra');
                }
              }, error => {
                console.log('error updateExportMaterial');
                console.log(error);
              });
            }
          });
      });
    } else {
      this.exportMaterialService.update(xuatVatTuParams).subscribe((res: number) => {
        if (res === 1) {
          this.notify.success('Sửa thành công!');
          this.router.navigate(['/admin/nghiep-vu/danh-sach-phieu-xuat']);
        } else if (res === -1) {
          this.notify.error('Số lượng xuất vượt quá');
        } else {
          this.notify.error('Có lỗi xảy ra');
        }
      }, error => {
        console.log('error updateExportMaterial');
        console.log(error);
      });
    }
  }

  deleteRow(idx: number, item: any) {
    this.listxuatchitiet = this.exportMaterialForm.get('listxuatchitiet') as FormArray;
    this.listxuatchitiet.removeAt(idx);

    this.listDelete.push({
      maPhieuXuat: this.exportMaterialForm.get('mxuatvattu.maPhieuXuat').value,
      maKho: this.exportMaterialForm.get('mxuatvattu.maKho').value,
      maPhieuNhap: item.maPhieuNhap,
      maVatTu: item.maVatTu
    });
  }

  checkStatus(idx: any, matVatTu: any, maPhieuNhap: any, soLuong: number) {
    const soLuongControl = this.exportMaterialForm.get(`listxuatchitiet.${idx}.soLuongXuat`);
    soLuongControl.setAsyncValidators(checkExportQuantityValidator(this.exportMaterialService,
      maPhieuNhap, matVatTu, soLuong));
    soLuongControl.updateValueAndValidity();
  }
}
