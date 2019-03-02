import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserListComponent } from './user-list/user-list.component';
import { UserListResolver } from 'src/app/shared/resolvers/user-list.resolver';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Người dùng'
        },
        children: [
            {
                path: 'danh-sach',
                component: UserListComponent,
                data: {
                    title: 'Danh sách'
                },
                resolve: { 'user-list': UserListResolver }
            },
            {
                path: '',
                redirectTo: 'danh-sach',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule { }
