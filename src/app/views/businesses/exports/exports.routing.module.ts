import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExportMaterialListComponent } from './export-material-list/export-material-list.component';
import { ExportMaterialCreateComponent } from './export-material-create/export-material-create.component';
import { ExportMaterialEditComponent } from './export-material-edit/export-material-edit.component';

import { ExportMaterialListResolver } from 'src/app/shared/resolvers/export-list-resolver';
import { ExportMaterialResolver } from 'src/app/shared/resolvers/export-material.resolver';
import { ExportMaterialCreateResolver } from 'src/app/shared/resolvers/export-material-create.resolver';
import { ExportMaterialEditResolver } from 'src/app/shared/resolvers/export-material-edit.resolver';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Xuất vật tư'
        },
        children: [
            {
                path: 'danh-sach',
                component: ExportMaterialListComponent,
                data: {
                    title: 'Danh sách phiếu xuất'
                },
                resolve: { 'export-material-list': ExportMaterialListResolver }
            },
            {
                path: 'tao-phieu-xuat',
                component: ExportMaterialCreateComponent,
                data: {
                    title: 'Tạo phiếu xuất'
                },
                resolve: { 'check-permission-create': ExportMaterialCreateResolver }
            },
            {
                path: 'sua-phieu-xuat/:id',
                component: ExportMaterialEditComponent,
                data: {
                    title: 'Sửa phiếu xuất'
                },
                resolve: {
                    'export-material': ExportMaterialResolver,
                    'check-permission-update': ExportMaterialEditResolver
                }
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
export class ExportsRoutingModule { }
