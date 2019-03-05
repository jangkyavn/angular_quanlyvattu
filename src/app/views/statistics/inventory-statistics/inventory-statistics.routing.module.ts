import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryStatisticListComponent } from './inventory-statistic-list/inventory-statistic-list.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Thống kê tồn kho'
        },
        children: [
            {
                path: 'danh-sach',
                component: InventoryStatisticListComponent,
                data: {
                    title: 'Danh sách thống kê tồn kho'
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
export class InventoryStatisticsRoutingModule { }
