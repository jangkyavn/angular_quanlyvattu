import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ImportsRoutingModule } from './imports.routing.module';
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

import { ImportMaterialListComponent } from './import-material-list/import-material-list.component';
import { ImportMaterialCreateComponent } from './import-material-create/import-material-create.component';
import { ImportMaterialEditComponent } from './import-material-edit/import-material-edit.component';
import {
  ImportMaterialViewDetailModalComponent
} from './modals/import-material-view-detail-modal/import-material-view-detail-modal.component';
import {
  ImportMaterialDetailAddEditModalComponent
} from './modals/import-material-detail-add-edit-modal/import-material-detail-add-edit-modal.component';

import { ImportMaterialListResolver } from 'src/app/shared/resolvers/import-list.resolver';
import { ImportMaterialResolver } from 'src/app/shared/resolvers/import-material.resolver';
import { ImportMaterialCreateResolver } from 'src/app/shared/resolvers/import-material-create.resolver';
import { ImportMaterialEditResolver } from 'src/app/shared/resolvers/import-material-edit.resolver';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ImportsRoutingModule,
    SharedModule,
    CurrencyMaskModule
  ],
  declarations: [
    ImportMaterialListComponent,
    ImportMaterialCreateComponent,
    ImportMaterialEditComponent,
    ImportMaterialViewDetailModalComponent,
    ImportMaterialDetailAddEditModalComponent
  ],
  entryComponents: [
    ImportMaterialViewDetailModalComponent,
    ImportMaterialDetailAddEditModalComponent
  ],
  providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    ImportMaterialListResolver,
    ImportMaterialResolver,
    ImportMaterialCreateResolver,
    ImportMaterialEditResolver
  ],
})
export class ImportsModule { }
