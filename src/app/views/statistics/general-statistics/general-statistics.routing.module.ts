import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneralStatisticListComponent } from './general-statistic-list/general-statistic-list.component';

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
