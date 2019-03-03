import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryListComponent } from './inventory-list/inventory-list.component';

import { InventoryListResolver } from 'src/app/shared/resolvers/inventory-list.resolver';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Vật tư tồn kho'
        },
        children: [
            {
                path: 'danh-sach',
                component: InventoryListComponent,
                data: {
                    title: 'Danh sách'
                },
                resolve: { 'inventory-list': InventoryListResolver }
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
export class InventoriesRoutingModule { }
