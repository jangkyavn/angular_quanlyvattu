import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImportStatisticListComponent } from './import-statistic-list/import-statistic-list.component';

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
export class ImportStatisticsRoutingModule { }
