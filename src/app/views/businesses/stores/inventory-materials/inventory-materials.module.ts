import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InventoryMaterialsRoutingModule } from './inventory-materials.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { InventoryMaterialListComponent } from './inventory-material-list/inventory-material-list.component';
import { InventoryMaterialCreateComponent } from './inventory-material-create/inventory-material-create.component';
import { InventoryMaterialEditComponent } from './inventory-material-edit/inventory-material-edit.component';
import {
  InventoryMateriaDetailAddEditModalComponent
} from './modals/inventory-materia-detail-add-edit-modal/inventory-materia-detail-add-edit-modal.component';

import { InventoryMaterialListResolver } from 'src/app/shared/resolvers/inventory-material-list.resolver';
import { InventoryMaterialResolver } from 'src/app/shared/resolvers/inventory-material.resolver';
import { InventoryMaterialCreateResolver } from 'src/app/shared/resolvers/inventory-material-create.resolver';
import { InventoryMaterialEditResolver } from 'src/app/shared/resolvers/inventory-material-edit.resolver';
// tslint:disable-next-line: max-line-length
import { InventoryMaterialViewDetailModalComponent } from './modals/inventoryMaterialViewDetailModal/inventoryMaterialViewDetailModal.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InventoryMaterialsRoutingModule,
    SharedModule
  ],
  declarations: [
    InventoryMaterialListComponent,
    InventoryMaterialCreateComponent,
    InventoryMaterialEditComponent,
    InventoryMateriaDetailAddEditModalComponent,
    InventoryMaterialViewDetailModalComponent
  ],
  entryComponents: [InventoryMateriaDetailAddEditModalComponent,InventoryMaterialViewDetailModalComponent],
  providers: [
    InventoryMaterialListResolver,
    InventoryMaterialResolver,
    InventoryMaterialCreateResolver,
    InventoryMaterialEditResolver
  ]
})
export class InventoryMaterialsModule { }
