import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SuppliesRoutingModule } from './supplies.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { SupplyListComponent } from './supply-list/supply-list.component';
import { SupplyAddEditModalComponent } from './modals/supply-add-edit-modal/supply-add-edit-modal.component';

import { SupplyListResolver } from 'src/app/shared/resolvers/supply-list.resolver';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SuppliesRoutingModule,
    SharedModule
  ],
  declarations: [
    SupplyListComponent,
    SupplyAddEditModalComponent
  ],
  entryComponents: [SupplyAddEditModalComponent],
  providers: [SupplyListResolver]
})
export class SuppliesModule { }
