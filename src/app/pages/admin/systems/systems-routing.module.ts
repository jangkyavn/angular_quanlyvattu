import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserListResolver } from '../../../shared/resolvers/user-list.resolver';

const routes: Routes = [
  { path: '', redirectTo: 'danh-sach-nguoi-dung', pathMatch: 'full' },
  {
    path: 'danh-sach-nguoi-dung', component: UserListComponent,
    resolve: { users: UserListResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemsRoutingModule { }
