import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnitListComponent } from './unit-list/unit-list.component';

import { UnitListResolver } from 'src/app/shared/resolvers/unit-list-resolver';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Đơn vị tính'
        },
        children: [
            {
                path: 'danh-sach',
                component: UnitListComponent,
                data: {
                    title: 'Danh sách'
                },
                resolve: { 'unit-list': UnitListResolver }
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
export class UnitsRoutingModule { }
