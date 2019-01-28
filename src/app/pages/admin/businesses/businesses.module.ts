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
import { ExportMaterialsComponent } from './export-materials/export-materials.component';
import { ExportListComponent } from './exports/export-list/export-list.component';
import { ExportMaterialListResolver } from 'src/app/shared/resolvers/export-list-resolver';
import { ExportAddModalComponent } from './imports/export-add-modal/export-add-modal.component';
import { ExportEditModalComponent } from './exports/export-edit-modal/export-edit-modal.component';
import { UpdateImportMaterialsComponent } from './update-import-materials/update-import-materials.component';
import { ImportMaterialDetailResolver } from 'src/app/shared/resolvers/import-material-detail.resolver';
import { UpdateExportMaterialsComponent } from './update-export-materials/update-export-materials.component';
import { ExportMaterialDetailResolver } from 'src/app/shared/resolvers/export-material-detail.resolver';

@NgModule({
  declarations: [BusinessesComponent,
    InventoryListComponent,
    ImportMaterialsComponent,
    ImportListComponent,
    ImportEditModalComponent,
    ExportMaterialsComponent,
    ExportListComponent,
    ExportAddModalComponent,
    ExportEditModalComponent,
    UpdateImportMaterialsComponent,
    UpdateExportMaterialsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BusinessesRoutingModule,
    NgZorroAntdModule,
    ModalModule.forRoot()
  ],
  providers: [InventoryListResolver,
    ImportMaterialListResolver,
    ImportMaterialDetailResolver,
    ExportMaterialListResolver,
    ExportMaterialDetailResolver
  ],
  entryComponents: [ImportEditModalComponent, ExportEditModalComponent]
})
export class BusinessesModule { }
