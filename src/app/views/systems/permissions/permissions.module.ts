import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PermissionsRoutingModule } from './permissions.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { PermissionListComponent } from './permission-list/permission-list.component';
import { PermissonAddEditModalComponent } from './modals/permisson-add-edit-modal/permisson-add-edit-modal.component';
import { MaintenanceComponent } from '../../maintenance/maintenance.component';

import { RoleListResolver } from 'src/app/shared/resolvers/role-list.resolver';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PermissionsRoutingModule,
    SharedModule
  ],
  declarations: [
    PermissionListComponent,
    PermissonAddEditModalComponent,
    MaintenanceComponent],
  entryComponents: [PermissonAddEditModalComponent],
  providers: [RoleListResolver],
})
export class PermissionsModule { }
