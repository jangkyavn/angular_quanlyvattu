import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialTypesRoutingModule } from './material-types.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { MaterialTypeListComponent } from './material-type-list/material-type-list.component';
import { MaterialTypeAddEditModalComponent } from './modals/material-type-add-edit-modal/material-type-add-edit-modal.component';

import { MaterialTypeListResolver } from 'src/app/shared/resolvers/material-type-list.resolver';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialTypesRoutingModule,
    SharedModule
  ],
  declarations: [
    MaterialTypeListComponent,
    MaterialTypeAddEditModalComponent
  ],
  entryComponents: [MaterialTypeAddEditModalComponent],
  providers: [MaterialTypeListResolver]
})
export class MaterialTypesModule { }
