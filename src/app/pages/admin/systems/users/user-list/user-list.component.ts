import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';

import { NotifyService } from '../../../../../shared/services/notify.service';
import { UserAddEditModalComponent } from '../user-add-edit-modal/user-add-edit-modal.component';
import { User } from '../../../../../shared/models/user.model';
import { Pagination, PaginatedResult } from '../../../../../shared/models/pagination.model';
import { UserService } from '../../../../../shared/services/user.service';
import { RoleEditModalComponent } from '../role-edit-modal/role-edit-modal.component';
import { Role } from 'src/app/shared/models/role.model';
import { RoleService } from '../../../../../shared/services/role.service';
import { UserParams } from 'src/app/shared/params/user.param';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  dataSet = [];
  loading = true;
  sortValue = null;
  sortKey = null;

  users: User[];
  pagination: Pagination;
  userParams: UserParams = {
    keyword: ''
  };

  constructor(
    private modalService: NzModalService,
    private route: ActivatedRoute,
    private userService: UserService,
    private roleService: RoleService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.loading = false;
      this.pagination = data['users'].pagination;
      this.dataSet = data['users'].result;
    });
  }

  sort(sort: { key: string, value: string }): void {
    this.userParams.sortKey = sort.key;
    this.userParams.sortValue = sort.value;
    this.loadData();
  }

  addNew() {
    const modal = this.modalService.create({
      nzTitle: 'Thêm mới người dùng',
      nzContent: UserAddEditModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzComponentParams: {
        user: {},
        isAddNew: true
      },
      nzFooter: [
        {
          label: 'Hủy',
          shape: 'default',
          onClick: (componentInstance) => {
            if (componentInstance.userForm.dirty) {
              const result = confirm('Bạn có chắc chắn muốn tiếp tục không? Mọi sự thay đổi không lưu sẽ bị mất');
              if (result) {
                modal.destroy();
              }
            } else {
              modal.destroy();
            }
          }
        },
        {
          label: 'Lưu',
          type: 'primary',
          loading: false,
          onClick: (componentInstance) => {
            componentInstance.saveChanges((res: boolean) => {
              if (res) {
                this.loadData();
                modal.destroy();
              } else {
                modal.destroy();
              }
            });
          }
        }
      ]
    });
  }

  update(id: any) {
    this.userService.getDetail(id).subscribe((user: User) => {
      const modal = this.modalService.create({
        nzTitle: 'Sửa thông tin người dùng',
        nzContent: UserAddEditModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzComponentParams: {
          user,
          isAddNew: false
        },
        nzFooter: [
          {
            label: 'Hủy',
            shape: 'default',
            onClick: (componentInstance) => {
              if (componentInstance.userForm.dirty) {
                const result = confirm('Bạn có chắc chắn muốn tiếp tục không? Mọi sự thay đổi không lưu sẽ bị mất');
                if (result) {
                  modal.destroy();
                }
              } else {
                modal.destroy();
              }
            }
          },
          {
            label: 'Lưu',
            type: 'primary',
            loading: false,
            onClick: (componentInstance) => {
              componentInstance.saveChanges((res: boolean) => {
                if (res) {
                  this.loadData();
                  modal.destroy();
                } else {
                  modal.destroy();
                }
              });
            }
          }
        ]
      });
    });
  }

  delete(id: any) {
    this.notify.confirm('Bạn có chắc chắn muốn xóa không?', () => {
      this.userService.delete(id).subscribe((res: boolean) => {
        if (res) {
          this.loadData();
        }
      }, error => {
        console.log(error);
        this.notify.error('Có lỗi xảy ra!');
      });
    });
  }

  editRoles(user: User) {
    const modal = this.modalService.create({
      nzTitle: 'Phân quyền người dùng',
      nzContent: RoleEditModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzComponentParams: {
        user
      },
      nzFooter: [
        {
          label: 'Hủy',
          shape: 'default',
          onClick: () => modal.destroy()
        },
        {
          label: 'Lưu',
          type: 'primary',
          loading: false,
          onClick: (componentInstance) => {
            componentInstance.updateRoles((res: Role[]) => {
              if (res && res.length > 0) {
                const roleEditViewModel = {
                  roleNames: [...res.filter(x => x.checked === true).map(x => x.name)]
                };

                if (roleEditViewModel) {
                  this.roleService.editRolesByUser(user, roleEditViewModel).subscribe(_ => {
                    user.roles = [...roleEditViewModel.roleNames];
                  }, error => {
                    console.log(error);
                  });
                }
              }
            });
          }
        }
      ]
    });
  }

  changeStatus(id: any) {
    this.userService.changeStatus(id).subscribe((res: boolean) => {
      if (res) {
        this.notify.success('Cập nhật trạng thái thành công');
      }
    }, error => {
      this.notify.error('Có lỗi xảy ra');
      console.log('changeStatusUser' + error);
    });
  }

  search(keyword: string) {
    this.userParams.keyword = keyword;
    this.loadData();
  }

  loadData(reset: boolean = false): void {
    if (reset) {
      this.pagination.currentPage = 1;
    }
    this.loading = true;
    this.userService.getAllPaging(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((res: PaginatedResult<User[]>) => {
        this.loading = false;
        this.pagination = res.pagination;
        this.dataSet = res.result;
      }, error => {
        this.notify.error('Có lỗi xảy ra');
        console.log('loadUsers: ' + error);
      });
  }
}
