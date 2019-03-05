import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Thống kê báo cáo'
        },
        children: [
            {
                path: '',
                redirectTo: 'thong-ke-nhap',
                pathMatch: 'full'
            },
            {
                path: 'thong-ke-nhap',
                loadChildren: './import-statistics/import-statistics.module#ImportStatisticsModule'
            },
            {
                path: 'thong-ke-xuat',
                loadChildren: './export-statistics/export-statistics.module#ExportStatisticsModule'
            },
            {
                path: 'thong-ke-thanh-ly',
                loadChildren: './liquidation-statistics/liquidation-statistics.module#LiquidationStatisticsModule'
            },
            {
                path: 'thong-ke-nhap-xuat-ton',
                loadChildren: './general-statistics/general-statistics.module#GeneralStatisticsModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StatisticsRoutingModule { }
