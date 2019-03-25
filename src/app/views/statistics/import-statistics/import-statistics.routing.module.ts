import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImportStatisticListComponent } from './import-statistic-list/import-statistic-list.component';
import { ImportStatisticDetailComponent } from './import-statistic-detail/import-statistic-detail.component';

import { MaterialDetailResolver } from 'src/app/shared/resolvers/material-detail.resolver';
import { ImportStatisticListResolver } from 'src/app/shared/resolvers/import-statistic-list.resolver';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Thống kê nhập'
        },
        children: [
            {
                path: 'danh-sach',
                component: ImportStatisticListComponent,
                data: {
                    title: 'Danh sách'
                },
                resolve: { 'import-statistic-list': ImportStatisticListResolver }
            },
            {
                path: 'xem-chi-tiet/:id',
                component: ImportStatisticDetailComponent,
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
export class ImportStatisticsRoutingModule { }
