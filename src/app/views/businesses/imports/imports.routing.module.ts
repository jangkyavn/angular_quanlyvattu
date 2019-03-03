import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImportMaterialListComponent } from './import-material-list/import-material-list.component';
import { ImportMaterialCreateComponent } from './import-material-create/import-material-create.component';
import { ImportMaterialEditComponent } from './import-material-edit/import-material-edit.component';

import { ImportMaterialListResolver } from 'src/app/shared/resolvers/import-list.resolver';
import { ImportMaterialResolver } from 'src/app/shared/resolvers/import-material.resolver';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Nhập vật tư'
        },
        children: [
            {
                path: 'danh-sach',
                component: ImportMaterialListComponent,
                data: {
                    title: 'Danh sách'
                },
                resolve: { 'import-material-list': ImportMaterialListResolver }
            },
            {
                path: 'tao-phieu-nhap',
                component: ImportMaterialCreateComponent,
                data: {
                    title: 'Tạo phiếu nhập'
                }
            },
            {
                path: 'sua-phieu-nhap/:id',
                component: ImportMaterialEditComponent,
                data: {
                    title: 'Sửa phiếu nhập'
                },
                resolve: { 'import-material': ImportMaterialResolver }
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
export class ImportsRoutingModule { }
