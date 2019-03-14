import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryMaterialListComponent } from './inventory-material-list/inventory-material-list.component';
import { InventoryMaterialCreateComponent } from './inventory-material-create/inventory-material-create.component';
import { InventoryMaterialEditComponent } from './inventory-material-edit/inventory-material-edit.component';

import { InventoryMaterialListResolver } from 'src/app/shared/resolvers/inventory-material-list.resolver';
import { InventoryMaterialResolver } from 'src/app/shared/resolvers/inventory-material.resolver';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Phiếu kiểm kê kho'
        },
        children: [
            {
                path: 'danh-sach',
                component: InventoryMaterialListComponent,
                data: {
                    title: 'Danh sách phiếu kiểm kê kho'
                },
                resolve: { 'inventory-material-list': InventoryMaterialListResolver }
            },
            {
                path: 'tao-phieu-kiem-ke',
                component: InventoryMaterialCreateComponent,
                data: {
                    title: 'Tạo phiếu kiểm kê'
                }
            },
            {
                path: 'sua-phieu-kiem-ke/:id',
                component: InventoryMaterialEditComponent,
                data: {
                    title: 'Sửa phiếu kiểm kê'
                },
                resolve: { 'inventory-material': InventoryMaterialResolver }
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
export class InventoryMaterialsRoutingModule { }
