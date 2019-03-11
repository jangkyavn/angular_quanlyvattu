import { Component, OnInit, Input } from '@angular/core';

import { FunctionService } from 'src/app/shared/services/function.service';
import { RoleService } from 'src/app/shared/services/role.service';
import { ActionService } from 'src/app/shared/services/action.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';
import { Function } from 'src/app/shared/models/function.model';
import { Permission } from 'src/app/shared/models/permission.model';
import { Role } from 'src/app/shared/models/role.model';
import { Action } from 'src/app/shared/models/action.model';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss']
})
export class RoleDetailComponent implements OnInit {
  @Input() role: Role;
  functions: Function[] = [];
  actions: Action[] = [];
  loading = true;
  sortValue = null;
  sortKey = null;

  pagination: Pagination = {
    currentPage: 1,
    itemsPerPage: 10
  };
  pagingParams: PagingParams = {
    keyword: '',
    sortKey: '',
    sortValue: ''
  };

  constructor(
    private roleService: RoleService,
    private functionService: FunctionService,
    private actionService: ActionService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.loadActions();
    this.loadData();
  }

  sort(sort: { key: string, value: string }): void {
    this.pagingParams.sortKey = sort.key;
    this.pagingParams.sortValue = sort.value;
    this.loadData();
  }

  loadActions() {
    this.actionService.getAll().subscribe((res: Action[]) => {
      this.actions = res;
    });
  }

  loadData(reset: boolean = false) {
    if (reset) {
      this.pagination.currentPage = 1;
    }
    this.loading = true;
    this.functionService.getAllPaging(this.pagination.currentPage, this.pagination.itemsPerPage, this.pagingParams)
      .subscribe((res: PaginatedResult<Function[]>) => {
        this.loading = false;
        this.pagination = res.pagination;
        this.functions = res.result;

        this.fillPermissions(this.role.id);
      });
  }

  fillPermissions(roleId?: any) {
    this.roleService.getListPermissionById(roleId).subscribe((res: Permission[]) => {
      if (res.length > 0) {
        const allLength = this.functions.length;
        const checkedLength = res.length;
        for (let i = 0; i < allLength; i++) {
          for (let j = 0; j < checkedLength; j++) {
            if (this.functions[i].maChucNang === res[j].maChucNang && res[j].maHanhDong === 'READ') {
              this.functions[i].read = true;
            } else if ((this.functions[i].maChucNang === res[j].maChucNang && res[j].maHanhDong === 'CREATE')) {
              this.functions[i].create = true;
            } else if ((this.functions[i].maChucNang === res[j].maChucNang && res[j].maHanhDong === 'UPDATE')) {
              this.functions[i].update = true;
            } else if ((this.functions[i].maChucNang === res[j].maChucNang && res[j].maHanhDong === 'DELETE')) {
              this.functions[i].delete = true;
            }
          }
        }
      }
    });
  }

  savePermission(functionId, actionType: string) {
    const permissionParams = {
      roleId: this.role.id,
      functionId,
      actionId: actionType
    };

    this.roleService.savePermission(permissionParams)
      .subscribe((res: boolean) => {
        if (res) {
          this.notify.success('Cập nhật thành công');
        } else {
          this.notify.success('Cập nhật thất bại');
        }
      }, _ => {
        this.notify.error('Có lỗi xảy ra');
        console.log('error savePermission');
      });
  }
}
