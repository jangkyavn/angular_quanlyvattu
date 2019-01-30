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

@Component({
  selector: 'app-update-import-materials',
  templateUrl: './update-import-materials.component.html',
  styleUrls: ['./update-import-materials.component.scss']
})
export class UpdateImportMaterialsComponent implements OnInit {
  materialStores: MaterialStore[];
  materialItems: MaterialItem[];
  materials: Material[];
  producingCountries: ProducingCountry[];
  manufacturers: Manufacturer[];
  importMaterial: ImportMaterial;
  submitted = false;
  importMaterialForm: FormGroup;
  listnhapchitiet: FormArray;
  listDelete: any[] = [];
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler($event: any) {
    if (this.importMaterialForm.dirty) {
      $event.returnValue = false;
    }
  }

  constructor(
    private route: ActivatedRoute,
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
    this.materialStores = [];
    this.createForm();
  }

  createForm() {
    this.importMaterialForm = this.fb.group({
      mnhapvattu: this.fb.group({}),
      listnhapchitiet: this.fb.array([])
    });

    this.route.data.subscribe(data => {
      const { mnhapvattu, listnhapchitiet } = data['import-material'];
      const formArray = this.importMaterialForm.get('listnhapchitiet') as FormArray;

      listnhapchitiet.map(item => {
        formArray.push(this.createItem(item));
      });

      this.importMaterialForm.setControl('mnhapvattu', this.createGroup(mnhapvattu));
      this.importMaterialForm.setControl('listnhapchitiet', formArray);
    });
  }

  createGroup(item: ImportMaterial): FormGroup {
    return this.fb.group({
      maPhieuNhap: [item.maPhieuNhap],
      maKho: [{ value: item.maKho, disabled: false }, [Validators.required]],
      maHM: [item.maHM, [Validators.required]],
      ngayNhap: [item.ngayNhap, [Validators.required]],
      chietKhau: [item.chietKhau, [checkChietKhauNanValidator, checkChietKhauRangeValidator]],
      ghiChu: [item.ghiChu]
    });
  }

  createItem(item: ImportMaterialDetail): FormGroup {
    return this.fb.group({
      maPhieuNhap: [item.maPhieuNhap],
      maVatTu: [{ value: item.maVatTu, disabled: false }, [Validators.required]],
      tenVT: [item.tenVT],
      soLuong: [item.soLuong, [Validators.required, checkQuantityKhongAmValidator]],
      donGia: [item.donGia, [Validators.required, checkPriceKhongAmValidator]],
      maNuoc: [item.maNuoc],
      maHang: [item.maHang],
      model: [item.model],
      seri: [item.seri],
      soKhung: [item.soKhung],
      soMay: [item.soMay],
      soDangKy: [item.soDangKy],
      dotMua: [item.dotMua],
      namSX: [item.namSX],
      phanCap: [item.phanCap],
      nguonGoc: [item.nguonGoc],
      ghiChu: [item.ghiChu]
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

  getStoreName() {
    const maKho = this.importMaterialForm.get('mnhapvattu.maKho').value;;
    return this.materialStores.filter(x => x.maKho === maKho).map(x => x.tenKho);
  }

  deleteRow(idx: number, maVatTu: any) {
    const maPhieuNhap = this.importMaterialForm.get('mnhapvattu.maPhieuNhap').value;
    const maKho = this.importMaterialForm.get('mnhapvattu.maKho').value;
    this.importMaterialService.checkStatusDeleteDetail(maPhieuNhap, maVatTu, maKho)
      .subscribe(res => {
        if (res) {
          this.listnhapchitiet = this.importMaterialForm.get('listnhapchitiet') as FormArray;
          this.listnhapchitiet.removeAt(idx);

          this.listDelete.push({
            maPhieuNhap: this.importMaterialForm.get('mnhapvattu.maPhieuNhap').value,
            maKho: this.importMaterialForm.get('mnhapvattu.maKho').value,
            maVatTu
          });
        } else {
          this.notify.error('Vật tư đã xuất, không được xóa');
        }
      });
  }

  saveChanges() {
    this.submitted = true;

    if (this.importMaterialForm.invalid) {
      return;
    }

    if (this.listDelete.length > 0) {
      this.listDelete.map((item, idx) => {
        ++idx;
        this.importMaterialService.deleteImportDetail(item.maPhieuNhap, item.maVatTu, item.maKho)
          .subscribe((res: boolean) => {
            console.log(res);
          }, error => {
            console.log('delete ImportDetails');
            console.log(error);
          }, () => {
            if (idx === this.listDelete.length) {
              const nhapVatTuParams = Object.assign({}, this.importMaterialForm.value);
              this.importMaterialService.update(nhapVatTuParams).subscribe((res: number) => {
                if (res === 1) {
                  this.notify.success('Sửa phiếu thành công!');
                  this.router.navigate(['/admin/nghiep-vu/danh-sach-phieu-nhap']);
                } else if (res === -1) {
                  this.notify.error('Số lượng nhập vượt quá');
                } else {
                  this.notify.error('Có lỗi xảy ra');
                }
              }, error => {
                console.log('error updateImportMaterial');
                console.log(error);
              });
            }
          });
      });
    } else {
      const nhapVatTuParams = Object.assign({}, this.importMaterialForm.value);
      this.importMaterialService.update(nhapVatTuParams).subscribe((res: number) => {
        if (res === 1) {
          this.notify.success('Sửa phiếu thành công!');
          this.router.navigate(['/admin/nghiep-vu/danh-sach-phieu-nhap']);
        } else if (res === -1) {
          this.notify.error('Số lượng nhập vượt quá');
        } else {
          this.notify.error('Có lỗi xảy ra');
        }
      }, error => {
        console.log('error updateImportMaterial');
        console.log(error);
      });
    }
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
