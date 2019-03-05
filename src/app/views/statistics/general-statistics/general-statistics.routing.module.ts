import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneralStatisticListComponent } from './general-statistic-list/general-statistic-list.component';
import { GeneralStatisticDetailComponent } from './general-statistic-detail/general-statistic-detail.component';

import { MaterialDetailResolver } from 'src/app/shared/resolvers/material-detail.resolver';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Thống kê nhập xuất tồn'
        },
        children: [
            {
                path: 'danh-sach',
                component: GeneralStatisticListComponent,
                data: {
                    title: 'Danh sách thống kê nhập xuất tồn'
                }
            },
            {
                path: 'xem-chi-tiet/:id',
                component: GeneralStatisticDetailComponent,
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
export class GeneralStatisticsRoutingModule { }
