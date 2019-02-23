import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BusinessesRoutingModule } from './businesses-routing.module';
import { PageMaintenanceComponent } from 'src/app/pages/page-maintenance/page-maintenance.component';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'right',
  allowNegative: true,
  decimal: '.',
  precision: 0,
  prefix: '',
  suffix: '',
  thousands: ','
};

import { BusinessesComponent } from './businesses.component';
import { InventoryListComponent } from './inventories/inventory-list/inventory-list.component';
import { InventoryListResolver } from 'src/app/shared/resolvers/inventory-list.resolver';
import { ImportMaterialsComponent } from './import-materials/import-materials.component';
import { ImportListComponent } from './imports/import-list/import-list.component';
import { ImportMaterialListResolver } from 'src/app/shared/resolvers/import-list.resolver';
import { ExportMaterialsComponent } from './export-materials/export-materials.component';
import { ExportListComponent } from './exports/export-list/export-list.component';
import { ExportMaterialListResolver } from 'src/app/shared/resolvers/export-list-resolver';
import { UpdateImportMaterialsComponent } from './update-import-materials/update-import-materials.component';
import { ImportMaterialDetailResolver } from 'src/app/shared/resolvers/import-material-detail.resolver';
import { UpdateExportMaterialsComponent } from './update-export-materials/update-export-materials.component';
import { ExportMaterialDetailResolver } from 'src/app/shared/resolvers/export-material-detail.resolver';
import {
  ImportMaterialDetailModalComponent
} from './update-import-materials/import-material-detail-modal/import-material-detail-modal.component';
import {
  ExportMaterialDetailModalComponent
} from './update-export-materials/export-material-detail-modal/export-material-detail-modal.component';
import {
  ImportViewDetailModalComponent
} from './imports/import-view-detail-modal/import-view-detail-modal.component';
import {
  ExportViewDetailModalComponent
} from './exports/export-view-detail-modal/export-view-detail-modal.component';

@NgModule({
  declarations: [BusinessesComponent,
    InventoryListComponent,
    ImportMaterialsComponent,
    ImportListComponent,
    ExportMaterialsComponent,
    ExportListComponent,
    UpdateImportMaterialsComponent,
    UpdateExportMaterialsComponent,
    ImportMaterialDetailModalComponent,
    PageMaintenanceComponent,
    ExportMaterialDetailModalComponent,
    ImportViewDetailModalComponent,
    ExportViewDetailModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BusinessesRoutingModule,
    NgZorroAntdModule,
    ModalModule.forRoot(),
    CurrencyMaskModule
  ],
  providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    InventoryListResolver,
    ImportMaterialListResolver,
    ImportMaterialDetailResolver,
    ExportMaterialListResolver,
    ExportMaterialDetailResolver
  ],
  entryComponents: [
    ImportMaterialDetailModalComponent,
    ExportMaterialDetailModalComponent,
    ImportViewDetailModalComponent,
    ExportViewDetailModalComponent
  ]
})
export class BusinessesModule { }
