import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProducingCountryListComponent } from './producing-country-list/producing-country-list.component';

import { ProducingCountryListResolver } from 'src/app/shared/resolvers/producing-country.resolver';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Nước sản xuất'
        },
        children: [
            {
                path: 'danh-sach',
                component: ProducingCountryListComponent,
                data: {
                    title: 'Danh sách'
                },
                resolve: { 'producing-country-list': ProducingCountryListResolver }
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
export class ProducingCountriesRoutingModule { }
