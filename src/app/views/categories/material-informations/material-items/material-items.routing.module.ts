import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialItemListComponent } from './material-item-list/material-item-list.component';

import { MaterialItemListResolver } from 'src/app/shared/resolvers/material-item-list.resolver';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Hạng mục vật tư'
        },
        children: [
            {
                path: '',
                redirectTo: 'danh-sach',
                pathMatch: 'full'
            },
            {
                path: 'danh-sach',
                component: MaterialItemListComponent,
                data: {
                    title: 'Danh sách'
                },
                resolve: { 'material-item-list': MaterialItemListResolver }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaterialItemsRoutingModule { }
