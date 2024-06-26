import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';

import { MaterialItem } from 'src/app/shared/models/material-item.model';
import { MaterialStore } from 'src/app/shared/models/material-store.model';

import { RoleService } from 'src/app/shared/services/role.service';
import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { MaterialItemService } from 'src/app/shared/services/material-item.service';
import { ImportMaterialService } from 'src/app/shared/services/import-material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { ImportMaterialDetailService } from 'src/app/shared/services/import-material-detail.service';

import { ImportMaterialDetail } from 'src/app/shared/models/import-material-detail.model';
import {
  ImportMaterialDetailAddEditModalComponent
} from '../modals/import-material-detail-add-edit-modal/import-material-detail-add-edit-modal.component';


@Component({
  selector: 'app-import-material-edit',
  templateUrl: './import-material-edit.component.html',
  styleUrls: ['./import-material-edit.component.scss']
})
export class ImportMaterialEditComponent implements OnInit {
  loading: boolean;
  materialStores: MaterialStore[];
  materialItems: MaterialItem[];
  importMaterialForm: FormGroup;
  materialItemId: number;
  importMaterialDetails: ImportMaterialDetail[] = [];
  totalAmount: number;
  totalAmountAfterDiscount: number;
  discountPrice: number;
  discount: number;
  formatterPercent = value => `${value} %`;
  parserPercent = value => value.replace(' %', '');

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && ($event.keyCode === 73 || $event.keyCode === 105)) {
      this.addImportDetail();
    }
  }

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
    this.route.data.subscribe(data => {
      const result = data['check-permission-update'];
      if (!result) {
        this.router.navigate(['/']);
        this.notify.warning('Bạn không có quyền');
      }
    });

    this.createForm();
  }

  createForm() {
    this.importMaterialForm = this.fb.group({
      maPhieuNhap: [null, [Validators.required]],
      maKho: [null, [Validators.required]],
      maHM: [null, [Validators.required]],
      nguoiNhap: [null],
      ngayNhap: [null, [Validators.required]],
      tenKho: [{ value: null, disabled: true }, [Validators.required]],
      tenHM: [{ value: null, disabled: true }, [Validators.required]],
      chietKhau: [0],
      ghiChu: [null],
      tongSoLuong: [null],
      tongSoTien: [null]
    });

    this.route.data.subscribe(data => {
      const { mnhapvattu, listnhapchitiet } = data['import-material'];
      if (!mnhapvattu.status) {
        this.router.navigate(['/nghiep-vu/nhap']);
        return;
      }

      this.materialItemId = mnhapvattu.maHM;
      this.importMaterialForm.patchValue(mnhapvattu);

      this.importMaterialDetails = listnhapchitiet;
      this.loadTotalPrice();

      this.importMaterialService.checkUpdateImportDate(mnhapvattu.maPhieuNhap)
        .subscribe((res: boolean) => {
          if (res) {
            this.importMaterialForm.controls['ngayNhap'].disable();
          } else {
            this.importMaterialForm.controls['ngayNhap'].enable();
          }
        });
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

  saveChanges() {
    if (this.importMaterialForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.importMaterialForm.controls) {
        this.importMaterialForm.controls[i].markAsDirty();
        this.importMaterialForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const importMaterial = Object.assign({}, this.importMaterialForm.getRawValue());
    this.importMaterialService.update(importMaterial).subscribe((res: any) => {
      if (res) {
        this.notify.success('Sửa thành công');
        this.importMaterialForm.markAsPristine();
        this.importMaterialForm.updateValueAndValidity();
        this.loadTotalPrice();
      }
    }, error => {
      this.notify.error('Có lỗi xảy ra');
      console.log('error updateImportMaterial');
      console.log(error);
    });
  }

  addImportDetail() {
    const { maPhieuNhap, maHM, maKho } = this.importMaterialForm.value;

    const modal = this.modalService.create({
      nzTitle: 'Thêm chi tiết phiếu nhập',
      nzContent: ImportMaterialDetailAddEditModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzComponentParams: {
        importMaterialId: maPhieuNhap,
        materialItemId: maHM,
        materialStoreId: maKho,
        isAddNew: true,
        importDetail: {
          maPhieuNhap
        }
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
            componentInstance.saveChanges();
          }
        }
      ]
    });

    modal.afterClose.subscribe((result: boolean) => {
      if (result) {
        this.materialItemId = maHM;
        this.loadImportDetails(maPhieuNhap);
      }
    });
  }

  loadImportDetails(importId: number) {
    this.loading = true;
    this.importMaterialDetailService.getAllByImportId(importId)
      .subscribe((res: ImportMaterialDetail[]) => {
        this.importMaterialDetails = res;
        this.loading = false;
        this.loadTotalPrice();
      });
  }

  updateImportDetail(importDetail: ImportMaterialDetail) {
    const { maPhieuNhap, maHM, maKho } = this.importMaterialForm.value;

    const modal = this.modalService.create({
      nzTitle: 'Sửa chi tiết phiếu nhập',
      nzContent: ImportMaterialDetailAddEditModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzComponentParams: {
        importMaterialId: maPhieuNhap,
        materialItemId: maHM,
        materialStoreId: maKho,
        importDetail,
        isAddNew: false
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
            componentInstance.saveChanges();
          }
        }
      ]
    });

    modal.afterClose.subscribe((result: boolean) => {
      if (result) {
        this.materialItemId = maHM;
        this.loadImportDetails(maPhieuNhap);
      }
    });
  }

  deleteImportDetail(importDetail: ImportMaterialDetail) {
    this.notify.confirm('Bạn có chắc chắn muốn xóa không?', () => {
      const { maPhieuNhap, maVatTu } = importDetail;
      const { maKho } = this.importMaterialForm.value;
      this.importMaterialDetailService.delete(maPhieuNhap, maVatTu, maKho)
        .subscribe((res: boolean) => {
          if (res) {
            this.loadImportDetails(maPhieuNhap);
            this.notify.success('Xóa thành công!');
          } else {
            this.notify.warning('Hàng đã xuất, không được xóa!');
          }
        }, error => {
          this.notify.error('Có lỗi xảy ra');
          console.log('error deleteImportDetail');
        });
    });
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
        const { chietKhau } = this.importMaterialForm.value;
        this.discount = chietKhau;
        this.totalAmountAfterDiscount = this.totalAmount * (1 - chietKhau / 100);
        this.discountPrice = this.totalAmount - this.totalAmountAfterDiscount;
      }
    });
  }
}
