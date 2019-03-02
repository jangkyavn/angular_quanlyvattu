import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialTypeListComponent } from './material-type-list/material-type-list.component';

import { MaterialTypeListResolver } from 'src/app/shared/resolvers/material-type-list.resolver';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Loại vật tư'
        },
        children: [
            {
                path: '',
                redirectTo: 'danh-sach',
                pathMatch: 'full'
            },
            {
                path: 'danh-sach',
                component: MaterialTypeListComponent,
                data: {
                    title: 'Danh sách'
                },
                resolve: { 'material-type-list': MaterialTypeListResolver }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaterialTypesRoutingModule { }
