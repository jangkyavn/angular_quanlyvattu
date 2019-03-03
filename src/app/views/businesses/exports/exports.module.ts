import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ExportsRoutingModule } from './exports.routing.module';
import { SharedModule } from 'src/app/shared.module';
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

import { ExportMaterialListComponent } from './export-material-list/export-material-list.component';
import { ExportMaterialCreateComponent } from './export-material-create/export-material-create.component';
import { ExportMaterialEditComponent } from './export-material-edit/export-material-edit.component';
import {
  ExportMaterialViewDetailModalComponent
} from './modals/export-material-view-detail-modal/export-material-view-detail-modal.component';
import {
  ExportMaterialDetailAddEditModalComponent
} from './modals/export-material-detail-add-edit-modal/export-material-detail-add-edit-modal.component';

import { ExportMaterialListResolver } from 'src/app/shared/resolvers/export-list-resolver';
import { ExportMaterialResolver } from 'src/app/shared/resolvers/export-material.resolver';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ExportsRoutingModule,
    SharedModule,
    CurrencyMaskModule
  ],
  declarations: [
    ExportMaterialListComponent,
    ExportMaterialCreateComponent,
    ExportMaterialEditComponent,
    ExportMaterialViewDetailModalComponent,
    ExportMaterialDetailAddEditModalComponent
  ],
  entryComponents: [
    ExportMaterialViewDetailModalComponent,
    ExportMaterialDetailAddEditModalComponent
  ],
  providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    ExportMaterialListResolver,
    ExportMaterialResolver
  ],
})
export class ExportsModule { }
