import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ManufacturersRoutingModule } from './manufacturers.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { ManufacturerListComponent } from './manufacturer-list/manufacturer-list.component';
import { ManufacturerAddEditModalComponent } from './modals/manufacturer-add-edit-modal/manufacturer-add-edit-modal.component';

import { ManufacturerListResolver } from 'src/app/shared/resolvers/manufacturer-list.resolver';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ManufacturersRoutingModule,
    SharedModule
  ],
  declarations: [
    ManufacturerListComponent,
    ManufacturerAddEditModalComponent
  ],
  entryComponents: [ManufacturerAddEditModalComponent],
  providers: [ManufacturerListResolver]
})
export class ManufacturersModule { }
