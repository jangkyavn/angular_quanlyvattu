import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { MaterialItem } from 'src/app/shared/models/material-item.model';
import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { Material } from 'src/app/shared/models/material.model';
import { ProducingCountry } from 'src/app/shared/models/producing-country.model';
import { Manufacturer } from 'src/app/shared/models/manufacturer.model';
import { ImportMaterialDetail } from 'src/app/shared/models/import-material-detail.model';
import { ImportMaterial } from 'src/app/shared/models/import-material.model';

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
    private router: Router,
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

    this.nhapVatTuParams = {
      mnhapvattu: {},
      listnhapchitiet: []
    };
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
    const materialDetail: ImportMaterialDetail = { };
    this.nhapVatTuParams.listnhapchitiet.push(materialDetail);
  }

  deleteRow(idx: number) {
    this.nhapVatTuParams.listnhapchitiet.splice(idx, 1);
  }

  saveChanges() {
    this.importMaterialService.addNew(this.nhapVatTuParams).subscribe((res: boolean) => {
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
