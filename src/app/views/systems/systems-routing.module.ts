import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Hệ thống'
        },
        children: [
            {
                path: 'nguoi-dung',
                loadChildren: './users/users.module#UsersModule'
            },
            {
                path: '',
                redirectTo: 'nguoi-dung',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SystemsRoutingModule { }
