import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

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

  nhapVatTuParams: {
    mnhapvattu: ImportMaterial,
    listnhapchitiet: ImportMaterialDetail[]
  };

  constructor(
    public bsModalRef: BsModalRef,
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
  }

  ngAfterViewInit() {
    ///////////////////
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
    this.importMaterialService.update(this.nhapVatTuParams).subscribe((res: number) => {
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
    });
  }

  deleteRow(idx: number, maVatTu: number) {
    const result = confirm('Ban co xoa khong?');
    if (result) {
      const { maPhieuNhap, maKho } = this.nhapVatTuParams.mnhapvattu;
      this.importMaterialService.deleteImportDetail(maPhieuNhap, maVatTu, maKho).subscribe((res: boolean) => {
        if (res) {
          this.nhapVatTuParams.listnhapchitiet.splice(idx, 1);
          this.notify.success('Xóa thành công');
        } else {
          //
        }
      });
    }
  }

  hideModal(importMaterialForm: NgForm) {
    if (importMaterialForm) {
      const result = confirm('Bạn có chắc chắn muốn tiếp tục không? Mọi sự thay đổi không lưu sẽ bị mất');
      if (result) {
        this.bsModalRef.hide();
      }
    } else {
      this.bsModalRef.hide();
    }
  }
}
