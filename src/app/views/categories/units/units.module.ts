import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UnitsRoutingModule } from './units.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { UnitListComponent } from './unit-list/unit-list.component';
import { UnitAddEditModalComponent } from './modals/unit-add-edit-modal/unit-add-edit-modal.component';

import { UnitListResolver } from 'src/app/shared/resolvers/unit-list-resolver';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UnitsRoutingModule,
    SharedModule
  ],
  declarations: [
    UnitListComponent,
    UnitAddEditModalComponent
  ],
  entryComponents: [UnitAddEditModalComponent],
  providers: [UnitListResolver]
})
export class UnitsModule { }
