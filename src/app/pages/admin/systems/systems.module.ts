import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SystemsRoutingModule } from './systems-routing.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { SystemsComponent } from './systems.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserAddEditModalComponent } from './users/user-add-edit-modal/user-add-edit-modal.component';
import { UserListResolver } from 'src/app/shared/resolvers/user-list.resolver';
import { RoleService } from 'src/app/shared/services/role.service';
import { RoleEditModalComponent } from './users/role-edit-modal/role-edit-modal.component';
import { UserViewDetailModalComponent } from './users/user-view-detail-modal/user-view-detail-modal.component';
import { ChangePasswordModalComponent } from './users/change-password-modal/change-password-modal.component';
import { HighlightSearchPipe } from 'src/app/shared/pipes/highlight-search.pipe';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  declarations: [
    SystemsComponent,
    UserListComponent,
    UserAddEditModalComponent,
    RoleEditModalComponent,
    UserViewDetailModalComponent,
    ChangePasswordModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SystemsRoutingModule,
    NgZorroAntdModule
  ],
  entryComponents: [
    UserAddEditModalComponent,
    RoleEditModalComponent,
    UserViewDetailModalComponent,
    ChangePasswordModalComponent
  ],
  providers: [UserListResolver, RoleService]
})
export class SystemsModule { }
