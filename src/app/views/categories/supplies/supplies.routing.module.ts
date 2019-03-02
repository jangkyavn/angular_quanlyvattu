import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupplyListComponent } from './supply-list/supply-list.component';
import { SupplyListResolver } from 'src/app/shared/resolvers/supply-list.resolver';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Nguồn cung cấp'
        },
        children: [
            {
                path: 'danh-sach',
                component: SupplyListComponent,
                data: {
                    title: 'Danh sách'
                },
                resolve: { 'supply-list': SupplyListResolver }
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
export class SuppliesRoutingModule { }
