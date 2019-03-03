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

import { LiquidationMaterialListResolver } from 'src/app/shared/resolvers/liquidation-material-list.resolver';
import { LiquidationMaterialResolver } from 'src/app/shared/resolvers/liquidation-material.resolver';

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
    LiquidationMaterialDetailAddEditModalComponent
  ],
  entryComponents: [
    LiquidationMaterialDetailAddEditModalComponent
  ],
  providers: [
    LiquidationMaterialListResolver,
    LiquidationMaterialResolver
  ],
})
export class LiquidationMaterialsModule { }
