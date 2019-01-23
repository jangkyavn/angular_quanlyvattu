import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SystemsRoutingModule } from './systems-routing.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { SystemsComponent } from './systems.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserAddEditModalComponent } from './users/user-add-edit-modal/user-add-edit-modal.component';
import { UserListResolver } from 'src/app/shared/resolvers/user-list.resolver';
import { RoleService } from 'src/app/shared/services/role.service';
import { RoleEditModalComponent } from './users/role-edit-modal/role-edit-modal.component';

@NgModule({
  declarations: [
    SystemsComponent,
    UserListComponent,
    UserAddEditModalComponent,
    RoleEditModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SystemsRoutingModule,
    NgZorroAntdModule,
    NgMultiSelectDropDownModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot()
  ],
  entryComponents: [UserAddEditModalComponent, RoleEditModalComponent],
  providers: [UserListResolver, RoleService]
})
export class SystemsModule { }
