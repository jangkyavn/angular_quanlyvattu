import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnitListComponent } from './units/unit-list/unit-list.component';
import { UnitListResolver } from 'src/app/shared/resolvers/unit-list-resolver';
import { SupplyListComponent } from './supplies/supply-list/supply-list.component';
import { SupplyListResolver } from 'src/app/shared/resolvers/supply-list.resolver';
import { ManufacturerListComponent } from './manufacturers/manufacturer-list/manufacturer-list.component';
import { ManufacturerListResolver } from 'src/app/shared/resolvers/manufacturer-list.resolver';
import { ProducingCountryListComponent } from './producing-countries/producing-country-list/producing-country-list.component';
import { ProducingCountryListResolver } from 'src/app/shared/resolvers/producing-country.resolver';
import { MaterialStoreListComponent } from './material-stores/material-store-list/material-store-list.component';
import { MaterialStoreListResolver } from 'src/app/shared/resolvers/material-store-list.resolver';
import { MaterialTypeListComponent } from './material-types/material-type-list/material-type-list.component';
import { MaterialTypeListResolver } from 'src/app/shared/resolvers/material-type-list.resolver';
import { MaterialItemListComponent } from './material-items/material-item-list/material-item-list.component';
import { MaterialItemListResolver } from 'src/app/shared/resolvers/material-item-list.resolver';
import { MaterialListComponent } from './materials/material-list/material-list.component';
import { MaterialListResolver } from 'src/app/shared/resolvers/material-list.resolver';
import { PersonnelListComponent } from './personnels/personnel-list/personnel-list.component';
import { PersonnelListResolver } from 'src/app/shared/resolvers/personnel-list-resolver';

const routes: Routes = [
  { path: '', redirectTo: 'nguon-cung-cap', pathMatch: 'full' },
  {
    path: 'nguon-cung-cap', component: SupplyListComponent,
    resolve: { 'supplies': SupplyListResolver }
  },
  {
    path: 'hang-muc-vat-tu', component: MaterialItemListComponent,
    resolve: { 'material-items': MaterialItemListResolver }
  },
  {
    path: 'loai-vat-tu', component: MaterialTypeListComponent,
    resolve: { 'material-types': MaterialTypeListResolver }
  },
  {
    path: 'danh-muc-vat-tu', component: MaterialListComponent,
    resolve: { 'materials': MaterialListResolver }
  },
  {
    path: 'don-vi-tinh', component: UnitListComponent,
    resolve: { 'units': UnitListResolver }
  },
  {
    path: 'kho-vat-tu', component: MaterialStoreListComponent,
    resolve: { 'material-stores': MaterialStoreListResolver }
  },
  {
    path: 'hang-san-xuat', component: ManufacturerListComponent,
    resolve: { 'manufacturers': ManufacturerListResolver }
  },
  {
    path: 'nuoc-san-xuat', component: ProducingCountryListComponent,
    resolve: { 'producing-countries': ProducingCountryListResolver }
  },
  {
    path: 'nhan-su', component: PersonnelListComponent,
    resolve: { 'personnels': PersonnelListResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
