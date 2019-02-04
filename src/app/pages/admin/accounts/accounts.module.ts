import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccountsRoutingModule } from './accounts-routing.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { AccountsComponent } from './accounts.component';
import { InformationsComponent } from './informations/informations.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    AccountsComponent,
    InformationsComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AccountsRoutingModule,
    NgZorroAntdModule
  ]
})
export class AccountsModule { }
