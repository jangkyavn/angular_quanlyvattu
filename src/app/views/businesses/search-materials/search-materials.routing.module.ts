import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchMaterialListComponent } from './search-material-list/search-material-list.component';
import { SearchMaterialDetailComponent } from './search-material-detail/search-material-detail.component';

import { MaterialListResolver } from 'src/app/shared/resolvers/material-list.resolver';
import { MaterialDetailResolver } from 'src/app/shared/resolvers/material-detail.resolver';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Tìm kiếm vật tư'
        },
        children: [
            {
                path: 'danh-sach',
                component: SearchMaterialListComponent,
                data: {
                    title: 'Danh sách tìm kiếm vật tư'
                },
                resolve: { 'search-material-list': MaterialListResolver }
            },
            {
                path: 'chi-tiet/:id',
                component: SearchMaterialDetailComponent,
                data: {
                    title: 'Chi tiết tìm kiếm vật tư'
                },
                resolve: { 'search-material': MaterialDetailResolver }
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
export class SearchMaterialsRoutingModule { }
