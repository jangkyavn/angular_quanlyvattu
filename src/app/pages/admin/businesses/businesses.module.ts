import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BusinessesRoutingModule } from './businesses-routing.module';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ModalModule } from 'ngx-bootstrap/modal';

import { BusinessesComponent } from './businesses.component';
import { InventoryListComponent } from './inventories/inventory-list/inventory-list.component';
import { InventoryListResolver } from 'src/app/shared/resolvers/inventory-list.resolver';
import { ImportMaterialsComponent } from './import-materials/import-materials.component';
import { ImportListComponent } from './imports/import-list/import-list.component';
import { ImportMaterialListResolver } from 'src/app/shared/resolvers/import-list.resolver';
import { ImportEditModalComponent } from './imports/import-edit-modal/import-edit-modal.component';

@NgModule({
  declarations: [BusinessesComponent,
    InventoryListComponent,
    ImportMaterialsComponent,
    ImportListComponent,
    ImportEditModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BusinessesRoutingModule,
    NgZorroAntdModule,
    ModalModule.forRoot()
  ],
  providers: [InventoryListResolver, ImportMaterialListResolver],
  entryComponents: [ImportEditModalComponent]
})
export class BusinessesModule { }
