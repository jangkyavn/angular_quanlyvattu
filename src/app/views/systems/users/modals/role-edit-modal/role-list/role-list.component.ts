import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { RoleService } from 'src/app/shared/services/role.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { Role } from 'src/app/shared/models/role.model';
import { User } from 'src/app/shared/models/user.model';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';
import { checkRoleNameDuplicateValidator } from 'src/app/shared/vailidators/check-role-name-duplicate-validator';
import { noWhitespaceValidator } from 'src/app/shared/vailidators/no-whitespace-validator';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {
  @Input() user: User;
  @Output() viewPermission = new EventEmitter<any>();
  roles: Role[] = [];
  loading = true;
  sortValue = null;
  sortKey = null;
  roleForm: FormGroup;
  disabledAddNewButton: boolean;

  pagination: Pagination = {
    currentPage: 1,
    itemsPerPage: 10
  };
  pagingParams: PagingParams = {
    keyword: '',
    sortKey: '',
    sortValue: '',
  };

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.disabledAddNewButton = false;

    this.loadData();
  }

  createForm(role: Role = null) {
    if (role == null) {
      this.roleForm = this.fb.group({
        id: [null],
        name: [null, [Validators.required, noWhitespaceValidator],
          [checkRoleNameDuplicateValidator(this.roleService, '')]
        ]
      });
    } else {
      this.roleForm = this.fb.group({
        id: [role.id],
        name: [role.name, [Validators.required, noWhitespaceValidator],
        [checkRoleNameDuplicateValidator(this.roleService, role.name)]
        ]
      });
    }
  }

  sort(sort: { key: string, value: string }): void {
    this.pagingParams.sortKey = sort.key;
    this.pagingParams.sortValue = sort.value;
    this.loadData();
  }

  loadData(reset: boolean = false) {
    if (reset) {
      this.pagination.currentPage = 1;
    }
    this.loading = true;
    this.roleService.getAllPaging(this.pagination.currentPage, this.pagination.itemsPerPage, this.pagingParams)
      .subscribe((res: PaginatedResult<Role[]>) => {
        this.loading = false;
        this.pagination = res.pagination;
        this.roles = [];

        const userRoles = this.user.roles;
        const availableRoles: any[] = res.result;

        for (let i = 0; i < availableRoles.length; i++) {
          let isMatch = false;
          for (let j = 0; j < userRoles.length; j++) {
            if (availableRoles[i].name === userRoles[j]) {
              isMatch = true;
              availableRoles[i].checked = true;
              this.roles.push({
                ...availableRoles[i],
                isSave: false
              });
              break;
            }
          }

          if (!isMatch) {
            availableRoles[i].checked = false;
            this.roles.push({
              ...availableRoles[i],
              isSave: false
            });
          }
        }
      });
  }

  updateRoles(callBack: (result: Role[]) => any) {
    callBack(this.roles);
  }

  addNew() {
    this.roles = [{
      id: null,
      name: '',
      checked: false,
      isSave: true,
    }, ...this.roles];
    this.disabledAddNewButton = true;
    this.createForm();
  }

  updateRow(role: Role, index: number) {
    this.disabledAddNewButton = true;
    for (let i = 0; i < this.roles.length; i++) {
      this.roles[i].isSave = false;
    }
    this.roles[index].isSave = true;
    this.createForm(role);
  }

  permission(data: Role) {
    this.viewPermission.emit({
      showPermission: true,
      role: data
    });
  }

  deleteRow(id: any) {
    this.roleService.delete(id).subscribe((res: boolean) => {
      if (res) {
        this.notify.success('Xóa thành công!');
        this.loadData();
      } else {
        console.log('Delete failed');
      }
    }, error => {
      console.log(error);
      this.notify.error('Có lỗi xảy ra!');
    });
  }

  saveRow() {
    if (this.roleForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.roleForm.controls) {
        this.roleForm.controls[i].markAsDirty();
        this.roleForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const role: Role = Object.assign({}, this.roleForm.value);
    role.phanQuyens = [];
    this.disabledAddNewButton = false;
    if (role.id == null) {
      this.roleService.addNew(role).subscribe((res: any) => {
        if (res) {
          this.notify.success('Thêm mới thành công!');
          this.loadData(true);
        }
      }, error => {
        this.notify.error('Có lỗi xảy ra!');
        console.log('error addRole');
      });
    } else {
      this.roleService.update(role).subscribe((res: any) => {
        if (res) {
          this.notify.success('Sửa thành công!');
          this.loadData();
        }
      }, error => {
        this.notify.error('Có lỗi xảy ra!');
        console.log('error updateRole');
      });
    }
  }

  cancelRow(index: number) {
    if (this.roleForm.value.id == null) {
      this.roles.splice(index, 1);
    }
    this.disabledAddNewButton = false;
    this.roles[index].isSave = false;
  }

  search(keyword: string) {
    this.disabledAddNewButton = false;
    this.pagingParams.keyword = keyword;
    this.loadData(true);
  }
}
