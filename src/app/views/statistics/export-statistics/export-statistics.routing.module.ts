import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExportStatisticListComponent } from './export-statistic-list/export-statistic-list.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Thống kê xuất'
        },
        children: [
            {
                path: 'danh-sach',
                component: ExportStatisticListComponent,
                data: {
                    title: 'Danh sách'
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
export class ExportStatisticsRoutingModule { }
