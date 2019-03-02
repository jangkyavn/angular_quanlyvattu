import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialItemsRoutingModule } from './material-items.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { MaterialItemListComponent } from './material-item-list/material-item-list.component';
import { MaterialItemEditModalComponent } from './modals/material-item-edit-modal/material-item-edit-modal.component';

import { MaterialItemListResolver } from 'src/app/shared/resolvers/material-item-list.resolver';

@NgModule({
  imports: [
    ReactiveFormsModule,
    MaterialItemsRoutingModule,
    SharedModule
  ],
  declarations: [
    MaterialItemListComponent,
    MaterialItemEditModalComponent
  ],
  entryComponents: [MaterialItemEditModalComponent],
  providers: [MaterialItemListResolver]
})
export class MaterialItemsModule { }
