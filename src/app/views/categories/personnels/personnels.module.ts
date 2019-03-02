import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PersonnelsRoutingModule } from './personnels.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { PersonnelListComponent } from './personnel-list/personnel-list.component';
import { PersonnelAddEditModalComponent } from './modals/personnel-add-edit-modal/personnel-add-edit-modal.component';
import { PersonnelViewDetailModalComponent } from './modals/personnel-view-detail-modal/personnel-view-detail-modal.component';

import { PersonnelListResolver } from 'src/app/shared/resolvers/personnel-list-resolver';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PersonnelsRoutingModule,
    SharedModule
  ],
  declarations: [
    PersonnelListComponent,
    PersonnelAddEditModalComponent,
    PersonnelViewDetailModalComponent
  ],
  entryComponents: [
    PersonnelAddEditModalComponent,
    PersonnelViewDetailModalComponent
  ],
  providers: [PersonnelListResolver]
})
export class PersonnelsModule { }
