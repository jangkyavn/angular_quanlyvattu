import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialListComponent } from './material-list/material-list.component';

import { MaterialListResolver } from 'src/app/shared/resolvers/material-list.resolver';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Vật tư'
        },
        children: [
            {
                path: '',
                redirectTo: 'danh-sach',
                pathMatch: 'full'
            },
            {
                path: 'danh-sach',
                component: MaterialListComponent,
                data: {
                    title: 'Danh sách'
                },
                resolve: { 'material-list': MaterialListResolver }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaterialsRoutingModule { }
