import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManufacturerListComponent } from './manufacturer-list/manufacturer-list.component';

import { ManufacturerListResolver } from 'src/app/shared/resolvers/manufacturer-list.resolver';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Hãng sản xuất'
        },
        children: [
            {
                path: 'danh-sach',
                component: ManufacturerListComponent,
                data: {
                    title: 'Danh sách'
                },
                resolve: { 'manufacturer-list': ManufacturerListResolver }
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
export class ManufacturersRoutingModule { }
