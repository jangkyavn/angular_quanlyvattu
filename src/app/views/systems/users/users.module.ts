import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsersRoutingModule } from './users.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { UserListComponent } from './user-list/user-list.component';
import { UserAddEditModalComponent } from './modals/user-add-edit-modal/user-add-edit-modal.component';
import { UserViewDetailModalComponent } from './modals/user-view-detail-modal/user-view-detail-modal.component';
import { ChangePasswordModalComponent } from './modals/change-password-modal/change-password-modal.component';
import { RoleEditModalComponent } from './modals/role-edit-modal/role-edit-modal.component';

import { UserListResolver } from 'src/app/shared/resolvers/user-list.resolver';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    SharedModule
  ],
  declarations: [
    UserListComponent,
    UserAddEditModalComponent,
    UserViewDetailModalComponent,
    ChangePasswordModalComponent,
    RoleEditModalComponent
  ],
  entryComponents: [
    UserAddEditModalComponent,
    UserViewDetailModalComponent,
    ChangePasswordModalComponent,
    RoleEditModalComponent
  ],
  providers: [UserListResolver]
})
export class UsersModule { }
