import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonnelListComponent } from './personnel-list/personnel-list.component';

import { PersonnelListResolver } from 'src/app/shared/resolvers/personnel-list-resolver';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Nhân sự'
        },
        children: [
            {
                path: 'danh-sach',
                component: PersonnelListComponent,
                data: {
                    title: 'Danh sách'
                },
                resolve: { 'personnel-list': PersonnelListResolver }
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
export class PersonnelsRoutingModule { }
