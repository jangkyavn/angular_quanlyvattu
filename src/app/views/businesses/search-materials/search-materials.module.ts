import { NgModule } from '@angular/core';

import { SearchMaterialsRoutingModule } from './search-materials.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { SearchMaterialListComponent } from './search-material-list/search-material-list.component';
import { SearchMaterialDetailComponent } from './search-material-detail/search-material-detail.component';
import { CardImportDetailsComponent } from './search-material-detail/card-import-details/card-import-details.component';
import { CardExportDetailsComponent } from './search-material-detail/card-export-details/card-export-details.component';
import { CardInventoriesComponent } from './search-material-detail/card-inventories/card-inventories.component';
import {
  CardLiquidationMaterialsComponent
} from './search-material-detail/card-liquidation-materials/card-liquidation-materials.component';

import { MaterialDetailResolver } from 'src/app/shared/resolvers/material-detail.resolver';
import { SearchMaterialListResolver } from 'src/app/shared/resolvers/search-material-list.resolver';
import { SearchMaterialDetailResolver } from 'src/app/shared/resolvers/search-material-detail.resolver';

@NgModule({
  imports: [
    SearchMaterialsRoutingModule,
    SharedModule
  ],
  declarations: [
    SearchMaterialListComponent,
    SearchMaterialDetailComponent,
    CardImportDetailsComponent,
    CardExportDetailsComponent,
    CardInventoriesComponent,
    CardLiquidationMaterialsComponent
  ],
  providers: [
    SearchMaterialListResolver,
    MaterialDetailResolver,
    SearchMaterialDetailResolver
  ]
})
export class SearchMaterialsModule { }
