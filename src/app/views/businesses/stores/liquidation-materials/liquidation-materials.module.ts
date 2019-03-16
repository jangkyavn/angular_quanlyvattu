import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LiquidationMaterialsRoutingModule } from './liquidation-materials.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { LiquidationMaterialListComponent } from './liquidation-material-list/liquidation-material-list.component';
import { LiquidationMaterialCreateComponent } from './liquidation-material-create/liquidation-material-create.component';
import { LiquidationMaterialEditComponent } from './liquidation-material-edit/liquidation-material-edit.component';
import {
  LiquidationMaterialDetailAddEditModalComponent
} from './modals/liquidation-material-detail-add-edit-modal/liquidation-material-detail-add-edit-modal.component';
import {
  LiquidationMaterialViewDetailModalComponent
} from './modals/liquidation-material-view-detail-modal/liquidation-material-view-detail-modal.component';

import { LiquidationMaterialListResolver } from 'src/app/shared/resolvers/liquidation-material-list.resolver';
import { LiquidationMaterialResolver } from 'src/app/shared/resolvers/liquidation-material.resolver';
import { LiquidationMaterialCreateResolver } from 'src/app/shared/resolvers/liquidation-material-create.resolver';
import { LiquidationMaterialEditResolver } from 'src/app/shared/resolvers/liquidation-material-edit.resolver';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LiquidationMaterialsRoutingModule,
    SharedModule
  ],
  declarations: [
    LiquidationMaterialListComponent,
    LiquidationMaterialCreateComponent,
    LiquidationMaterialEditComponent,
    LiquidationMaterialDetailAddEditModalComponent,
    LiquidationMaterialViewDetailModalComponent
  ],
  entryComponents: [
    LiquidationMaterialDetailAddEditModalComponent,
    LiquidationMaterialViewDetailModalComponent
  ],
  providers: [
    LiquidationMaterialListResolver,
    LiquidationMaterialResolver,
    LiquidationMaterialCreateResolver,
    LiquidationMaterialEditResolver
  ],
})
export class LiquidationMaterialsModule { }
