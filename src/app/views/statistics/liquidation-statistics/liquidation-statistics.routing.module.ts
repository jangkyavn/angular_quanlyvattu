import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiquidationStatisticListComponent } from './liquidation-statistic-list/liquidation-statistic-list.component';
import { LiquidationStatisticDetailComponent } from './liquidation-statistic-detail/liquidation-statistic-detail.component';

import { MaterialDetailResolver } from 'src/app/shared/resolvers/material-detail.resolver';
import { LiquidationStatisticListResolver } from 'src/app/shared/resolvers/liquidation-statistic-list.resolver';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Thống kê thanh lý'
        },
        children: [
            {
                path: 'danh-sach',
                component: LiquidationStatisticListComponent,
                data: {
                    title: 'Danh sách'
                },
                resolve: { 'liquidation-statistic-list': LiquidationStatisticListResolver }
            },
            {
                path: 'xem-chi-tiet/:id',
                component: LiquidationStatisticDetailComponent,
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
export class LiquidationStatisticsRoutingModule { }
