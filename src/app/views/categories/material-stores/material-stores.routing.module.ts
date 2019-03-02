import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialStoreListComponent } from './material-store-list/material-store-list.component';

import { MaterialStoreListResolver } from 'src/app/shared/resolvers/material-store-list.resolver';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Kho vật tư'
        },
        children: [
            {
                path: 'danh-sach',
                component: MaterialStoreListComponent,
                data: {
                    title: 'Danh sách'
                },
                resolve: { 'material-store-list': MaterialStoreListResolver }
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
export class MaterialStoresRoutingModule { }
