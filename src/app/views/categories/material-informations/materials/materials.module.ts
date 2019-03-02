import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialsRoutingModule } from './materials.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { MaterialListComponent } from './material-list/material-list.component';
import { MaterialAddEditModalComponent } from './modals/material-add-edit-modal/material-add-edit-modal.component';
import { MaterialExportExcelModalComponent } from './modals/material-export-excel-modal/material-export-excel-modal.component';

import { MaterialListResolver } from 'src/app/shared/resolvers/material-list.resolver';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialsRoutingModule,
    SharedModule
  ],
  declarations: [
    MaterialListComponent,
    MaterialAddEditModalComponent,
    MaterialExportExcelModalComponent
  ],
  entryComponents: [
    MaterialAddEditModalComponent,
    MaterialExportExcelModalComponent
  ],
  providers: [MaterialListResolver]
})
export class MaterialsModule { }
