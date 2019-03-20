import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialStoresRoutingModule } from './material-stores.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { MaterialStoreListComponent } from './material-store-list/material-store-list.component';
import { MaterialStoreAddEditModalComponent } from './modals/material-store-add-edit-modal/material-store-add-edit-modal.component';

import { MaterialStoreListResolver } from 'src/app/shared/resolvers/material-store-list.resolver';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialStoresRoutingModule,
    SharedModule
  ],
  declarations: [
    MaterialStoreListComponent,
    MaterialStoreAddEditModalComponent
  ],
  entryComponents: [MaterialStoreAddEditModalComponent],
  providers: [MaterialStoreListResolver]
})
export class MaterialStoresModule { }
