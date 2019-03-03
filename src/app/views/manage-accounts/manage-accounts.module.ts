import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ManageAccountsRoutingModule } from './manage-accounts.routing.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { ManageAccountsComponent } from './manage-accounts.component';
import { UpdateInformationsComponent } from './update-informations/update-informations.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ManageAccountsRoutingModule,
    NgZorroAntdModule
  ],
  declarations: [
    ManageAccountsComponent,
    UpdateInformationsComponent,
    ChangePasswordComponent
  ]
})
export class ManageAccountsModule { }
