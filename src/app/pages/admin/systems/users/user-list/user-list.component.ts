import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';

import { NotifyService } from '../../../../../shared/services/notify.service';
import { UserService } from '../../../../../shared/services/user.service';
import { RoleService } from '../../../../../shared/services/role.service';

import { UserAddEditModalComponent } from '../user-add-edit-modal/user-add-edit-modal.component';
import { User } from '../../../../../shared/models/user.model';
import { Pagination, PaginatedResult } from '../../../../../shared/models/pagination.model';
import { RoleEditModalComponent } from '../role-edit-modal/role-edit-modal.component';
import { Role } from 'src/app/shared/models/role.model';
import { PagingParams } from 'src/app/shared/params/paging.param';
import { UserViewDetailModalComponent } from '../user-view-detail-modal/user-view-detail-modal.component';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';

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

  pagination: Pagination;
  pagingParams: PagingParams = {
    keyword: '',
    sortKey: '',
    sortValue: ''
  };

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && ($event.keyCode === 73 || $event.keyCode === 105)) {
      this.addNew();
    }
  }

  constructor(
    private route: ActivatedRoute,
    private modalService: NzModalService,
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
    this.pagingParams.sortKey = sort.key;
    this.pagingParams.sortValue = sort.value;
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
          onClick: () => modal.destroy()
        },
        {
          label: 'Lưu',
          type: 'primary',
          onClick: (componentInstance) => {
            componentInstance.saveChanges();
          }
        }
      ]
    });

    modal.afterClose.subscribe((result: boolean) => {
      if (result) {
        this.loadData();
      }
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
            onClick: () => modal.destroy()
          },
          {
            label: 'Lưu',
            type: 'primary',
            onClick: (componentInstance) => {
              componentInstance.saveChanges();
            }
          }
        ]
      });

      modal.afterClose.subscribe((result: boolean) => {
        if (result) {
          this.loadData();
        }
      });
    });
  }

  delete(id: any) {
    this.notify.confirm('Bạn có chắc chắn muốn xóa không?', () => {
      this.userService.delete(id).subscribe((res: boolean) => {
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

              modal.destroy();
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
    this.pagingParams.keyword = keyword;
    this.loadData(true);
  }

  view(id: any) {
    this.userService.getDetail(id).subscribe((user: User) => {
      const modal = this.modalService.create({
        nzTitle: 'Xem thông tin người dùng',
        nzContent: UserViewDetailModalComponent,
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
          }
        ]
      });
    });
  }

  loadData(reset: boolean = false): void {
    if (reset) {
      this.pagination.currentPage = 1;
    }
    this.loading = true;
    this.userService.getAllPaging(this.pagination.currentPage, this.pagination.itemsPerPage, this.pagingParams)
      .subscribe((res: PaginatedResult<User[]>) => {
        this.loading = false;
        this.pagination = res.pagination;
        this.dataSet = res.result;
      }, error => {
        this.notify.error('Có lỗi xảy ra');
        console.log('loadUsers: ' + error);
      });
  }

  changePassword(id: any) {
    const modal = this.modalService.create({
      nzTitle: 'Đổi mật khẩu',
      nzContent: ChangePasswordModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzComponentParams: {
        id
      },
      nzFooter: [
        {
          label: 'Hủy',
          shape: 'default',
          onClick: () => modal.destroy()
        },
        {
          label: 'Lưu',
          shape: 'primary',
          onClick: (componentInstance) => {
            componentInstance.saveChanges();
          }
        }
      ]
    });
  }
}
