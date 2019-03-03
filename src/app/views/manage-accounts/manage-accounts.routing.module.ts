import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageAccountsComponent } from './manage-accounts.component';

const routes: Routes = [
    {
        path: '',
        component: ManageAccountsComponent,
        data: {
            title: 'Quản lý tài khoản'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageAccountsRoutingModule { }
