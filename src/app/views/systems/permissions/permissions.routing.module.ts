import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionListComponent } from './permission-list/permission-list.component';

import { RoleListResolver } from 'src/app/shared/resolvers/role-list.resolver';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Phân quyền'
        },
        children: [
            {
                path: 'danh-sach',
                component: PermissionListComponent,
                data: {
                    title: 'Danh sách'
                },
                resolve: { 'role-list': RoleListResolver }
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
export class PermissionsRoutingModule { }
