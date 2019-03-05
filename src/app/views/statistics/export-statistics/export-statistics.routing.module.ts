import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExportStatisticListComponent } from './export-statistic-list/export-statistic-list.component';
import { ExportStatisticDetailComponent } from './export-statistic-detail/export-statistic-detail.component';

import { MaterialDetailResolver } from 'src/app/shared/resolvers/material-detail.resolver';

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
                path: 'xem-chi-tiet/:id',
                component: ExportStatisticDetailComponent,
                data: {
                    title: 'Xem chi tiết'
                },
                resolve: { 'material-statistic-detail': MaterialDetailResolver }
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
