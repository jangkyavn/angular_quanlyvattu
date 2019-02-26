import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { UnitListComponent } from './units/unit-list/unit-list.component';
import { UnitAddEditModalComponent } from './units/unit-add-edit-modal/unit-add-edit-modal.component';
import { UnitListResolver } from 'src/app/shared/resolvers/unit-list-resolver';
import { SupplyListComponent } from './supplies/supply-list/supply-list.component';
import { SupplyAddEditModalComponent } from './supplies/supply-add-edit-modal/supply-add-edit-modal.component';
import { SupplyListResolver } from 'src/app/shared/resolvers/supply-list.resolver';
import { ManufacturerListComponent } from './manufacturers/manufacturer-list/manufacturer-list.component';
import { ManufacturerAddEditModalComponent } from './manufacturers/manufacturer-add-edit-modal/manufacturer-add-edit-modal.component';
import { ManufacturerListResolver } from 'src/app/shared/resolvers/manufacturer-list.resolver';
import { ProducingCountryListComponent } from './producing-countries/producing-country-list/producing-country-list.component';
import {
  ProducingCountryAddEditModalComponent
} from './producing-countries/producing-country-add-edit-modal/producing-country-add-edit-modal.component';
import { ProducingCountryListResolver } from 'src/app/shared/resolvers/producing-country.resolver';
import { MaterialStoreListComponent } from './material-stores/material-store-list/material-store-list.component';
import {
  MaterialStoreAddEditModalComponent
} from './material-stores/material-store-add-edit-modal/material-store-add-edit-modal.component';
import { MaterialStoreListResolver } from 'src/app/shared/resolvers/material-store-list.resolver';
import { MaterialTypeListComponent } from './material-types/material-type-list/material-type-list.component';
import { MaterialTypeAddEditModalComponent } from './material-types/material-type-add-edit-modal/material-type-add-edit-modal.component';
import { MaterialTypeListResolver } from 'src/app/shared/resolvers/material-type-list.resolver';
import { MaterialItemListComponent } from './material-items/material-item-list/material-item-list.component';
import { MaterialItemAddEditModalComponent } from './material-items/material-item-add-edit-modal/material-item-add-edit-modal.component';
import { MaterialListComponent } from './materials/material-list/material-list.component';
import { MaterialAddEditModalComponent } from './materials/material-add-edit-modal/material-add-edit-modal.component';
import { MaterialItemListResolver } from 'src/app/shared/resolvers/material-item-list.resolver';
import { MaterialListResolver } from 'src/app/shared/resolvers/material-list.resolver';
import { PersonnelListComponent } from './personnels/personnel-list/personnel-list.component';
import { PersonnelAddEditModalComponent } from './personnels/personnel-add-edit-modal/personnel-add-edit-modal.component';
import { PersonnelListResolver } from 'src/app/shared/resolvers/personnel-list-resolver';
import { PersonnelViewDetailModalComponent } from './personnels/personnel-view-detail-modal/personnel-view-detail-modal.component';
import { MaterialExportModalComponent } from './materials/material-export-modal/material-export-modal.component';

@NgModule({
  declarations: [CategoriesComponent,
    UnitListComponent,
    UnitAddEditModalComponent,
    SupplyListComponent,
    SupplyAddEditModalComponent,
    ManufacturerListComponent,
    ManufacturerAddEditModalComponent,
    ProducingCountryListComponent,
    ProducingCountryAddEditModalComponent,
    MaterialStoreListComponent,
    MaterialStoreAddEditModalComponent,
    MaterialTypeListComponent,
    MaterialTypeAddEditModalComponent,
    MaterialItemListComponent,
    MaterialItemAddEditModalComponent,
    MaterialListComponent,
    MaterialAddEditModalComponent,
    PersonnelListComponent,
    PersonnelAddEditModalComponent,
    PersonnelViewDetailModalComponent,
    MaterialExportModalComponent
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ModalModule.forRoot()
  ],
  providers: [
    UnitListResolver,
    SupplyListResolver,
    ManufacturerListResolver,
    ProducingCountryListResolver,
    MaterialStoreListResolver,
    MaterialTypeListResolver,
    MaterialItemListResolver,
    MaterialListResolver,
    PersonnelListResolver
  ],
  entryComponents: [
    UnitAddEditModalComponent,
    SupplyAddEditModalComponent,
    ManufacturerAddEditModalComponent,
    ProducingCountryAddEditModalComponent,
    MaterialStoreAddEditModalComponent,
    MaterialTypeAddEditModalComponent,
    MaterialItemAddEditModalComponent,
    MaterialAddEditModalComponent,
    PersonnelAddEditModalComponent,
    PersonnelViewDetailModalComponent,
    MaterialExportModalComponent
  ]
})
export class CategoriesModule { }
