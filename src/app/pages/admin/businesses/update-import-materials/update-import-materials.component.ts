import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { MaterialItem } from 'src/app/shared/models/material-item.model';
import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { Material } from 'src/app/shared/models/material.model';
import { ProducingCountry } from 'src/app/shared/models/producing-country.model';
import { Manufacturer } from 'src/app/shared/models/manufacturer.model';
import { ImportMaterial } from 'src/app/shared/models/import-material.model';

import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { MaterialItemService } from 'src/app/shared/services/material-item.service';
import { MaterialService } from 'src/app/shared/services/material.service';
import { ProducingCountryService } from 'src/app/shared/services/producing-country.service';
import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';
import { ImportMaterialService } from 'src/app/shared/services/import-material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { ImportMaterialDetail } from 'src/app/shared/models/import-material-detail.model';
import { checkImportQuantityValidator } from 'src/app/shared/vailidators/check-import-quantity-validator';
import { checkChietKhauNanValidator } from 'src/app/shared/vailidators/check-chiet-khau-nan-validator';
import { checkChietKhauRangeValidator } from 'src/app/shared/vailidators/check-chiet-khau-range-validator';
import { checkQuantityKhongAmValidator } from 'src/app/shared/vailidators/check-quantity-khong-am.validator';
import { checkPriceKhongAmValidator } from 'src/app/shared/vailidators/check-price-khong-am-validator';
import { MaterialType } from 'src/app/shared/models/material-type.model';
import { ImportMaterialDetailService } from 'src/app/shared/services/import-material-detail.service';
import { NzModalService } from 'ng-zorro-antd';
import { ImportMaterialDetailModalComponent } from '../import-material-detail-modal/import-material-detail-modal.component';

@Component({
  selector: 'app-update-import-materials',
  templateUrl: './update-import-materials.component.html',
  styleUrls: ['./update-import-materials.component.scss']
})
export class UpdateImportMaterialsComponent implements OnInit {
  loading: boolean;
  materialStores: MaterialStore[];
  materialItems: MaterialItem[];
  materialTypes: MaterialType[];
  importMaterialForm: FormGroup;
  materialItemId: number;
  importMaterialDetails: ImportMaterialDetail[];
  formatterPercent = value => `${value} %`;
  parserPercent = value => value.replace(' %', '');
  // @HostListener('window:beforeunload', ['$event'])
  // beforeunloadHandler($event: any) {
  //   if (this.importMaterialForm.dirty) {
  //     $event.returnValue = false;
  //   }
  // }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private importMaterialService: ImportMaterialService,
    private materialStoreService: MaterialStoreService,
    private materialItemService: MaterialItemService,
    private importMaterialDetailService: ImportMaterialDetailService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.importMaterialDetails = [];

    this.loadAllMaterialStore();
    this.loadAllMaterialItems();
    this.createForm();
  }

  createForm() {
    this.importMaterialForm = this.fb.group({
      maPhieuNhap: [null, [Validators.required]],
      maKho: [null, [Validators.required]],
      maHM: [null, [Validators.required]],
      ngayNhap: [null, [Validators.required]],
      chietKhau: [0, [checkChietKhauNanValidator, checkChietKhauRangeValidator]],
      ghiChu: [null]
    });

    this.route.data.subscribe(data => {
      const { mnhapvattu, listnhapchitiet } = data['import-material'];

      this.materialItemId = mnhapvattu.maHM;
      this.importMaterialForm.patchValue(mnhapvattu);
      this.importMaterialDetails = listnhapchitiet;
    });
  }

  loadAllMaterialStore() {
    this.materialStoreService.getAll().subscribe((res: MaterialStore[]) => {
      this.materialStores = res;
    });
  }

  loadAllMaterialItems() {
    this.materialItemService.getAll().subscribe((res: MaterialItem[]) => {
      this.materialItems = res;
    });
  }

  getStoreName() {
    const maKho = this.importMaterialForm.get('mnhapvattu.maKho').value;
    return this.materialStores.filter(x => x.maKho === maKho).map(x => x.tenKho);
  }

  deleteRow(idx: number, maVatTu: any) {
    // const maPhieuNhap = this.importMaterialForm.get('mnhapvattu.maPhieuNhap').value;
    // const maKho = this.importMaterialForm.get('mnhapvattu.maKho').value;
    // this.importMaterialService.checkStatusDeleteDetail(maPhieuNhap, maVatTu, maKho)
    //   .subscribe(res => {
    //     if (res) {
    //       this.listnhapchitiet = this.importMaterialForm.get('listnhapchitiet') as FormArray;
    //       this.listnhapchitiet.removeAt(idx);

    //       this.listDelete.push({
    //         maPhieuNhap: this.importMaterialForm.get('mnhapvattu.maPhieuNhap').value,
    //         maKho: this.importMaterialForm.get('mnhapvattu.maKho').value,
    //         maVatTu
    //       });
    //     } else {
    //       this.notify.error('Vật tư đã xuất, không được xóa');
    //     }
    //   });
  }

  saveChanges() {
    if (this.importMaterialForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.importMaterialForm.controls) {
        this.importMaterialForm.controls[i].markAsDirty();
        this.importMaterialForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const importMaterial = Object.assign({}, this.importMaterialForm.value);
    this.importMaterialService.update(importMaterial).subscribe((res: any) => {
      if (res) {
        this.notify.success('Sửa thành công');
        this.importMaterialForm.markAsPristine();
        this.importMaterialForm.updateValueAndValidity();
      }
    }, error => {
      this.notify.error('Có lỗi xảy ra');
      console.log('error updateImportMaterial');
      console.log(error);
    });
  }

  addImportDetail() {
    const { maPhieuNhap, maHM } = this.importMaterialForm.value;

    const modal = this.modalService.create({
      nzTitle: 'Thêm chi tiết nhập vật tư',
      nzContent: ImportMaterialDetailModalComponent,
      nzMaskClosable: false,
      nzComponentParams: {
        importMaterialId: maPhieuNhap,
        materialItemId: maHM
      },
      nzFooter: [
        {
          label: 'Hủy',
          shape: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Lưu',
          type: 'primary',
          onClick: (componentInstance) => {
            componentInstance.saveChanges((res: boolean) => {
              if (res) {
                this.loading = true;
                modal.destroy();
                this.materialItemId = maHM;
                console.log(this.materialItemId);
                this.loadImportDetails(maPhieuNhap);
              } else {
                modal.destroy();
              }
            });
          }
        }
      ]
    });
  }

  loadImportDetails(importId: number) {
    this.importMaterialDetailService.getAllByImportId(importId)
      .subscribe((res: ImportMaterialDetail[]) => {
        this.importMaterialDetails = res;
        this.loading = false;
      });
  }

  checkStatus(idx: any, matVatTu: any, soLuong: number) {
    const maPhieuNhap = this.importMaterialForm.get('mnhapvattu.maPhieuNhap').value;
    const maKho = this.importMaterialForm.get('mnhapvattu.maKho').value;
    const soLuongControl = this.importMaterialForm.get(`listnhapchitiet.${idx}.soLuong`);
    soLuongControl.setAsyncValidators(checkImportQuantityValidator(this.importMaterialService,
      maPhieuNhap, maKho, matVatTu, soLuong));
    soLuongControl.updateValueAndValidity();
  }
}
