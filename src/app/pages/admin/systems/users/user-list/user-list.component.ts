import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { NotifyService } from '../../../../../shared/services/notify.service';
import { UserAddEditModalComponent } from '../user-add-edit-modal/user-add-edit-modal.component';
import { User } from '../../../../../shared/models/user.model';
import { Pagination, PaginatedResult } from '../../../../../shared/models/pagination.model';
import { UserService } from '../../../../../shared/services/user.service';
import { RoleEditModalComponent } from '../role-edit-modal/role-edit-modal.component';
import { Role } from 'src/app/shared/models/role.model';
import { RoleService } from '../../../../../shared/services/role.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  bsModalRef: BsModalRef;
  users: User[];
  pagination: Pagination;
  userParams: any = {
    keyword: ''
  };

  constructor(
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private userService: UserService,
    private roleService: RoleService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
  }

  addNew() {
    const modalOption: ModalOptions = {
      backdrop: 'static',
      initialState: {
        title: 'Thêm mới người dùng',
        user: {},
        isAddNew: true
      }
    };
    this.bsModalRef = this.modalService.show(UserAddEditModalComponent, modalOption);
    this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
      if (res) {
        this.loadData();
      }
    });
  }

  update(id: any) {
    this.userService.getDetail(id).subscribe((user: User) => {
      const modalOption: ModalOptions = {
        backdrop: 'static',
        initialState: {
          title: 'Sửa thông tin người dùng',
          user,
          isAddNew: false
        }
      };
      this.bsModalRef = this.modalService.show(UserAddEditModalComponent, modalOption);
      this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
        if (res) {
          this.loadData();
        }
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
    const modalOption: ModalOptions = {
      backdrop: 'static',
      initialState: {
        user
      }
    };
    this.bsModalRef = this.modalService.show(RoleEditModalComponent, modalOption);
    this.bsModalRef.content.saveRoles.subscribe((res: Role[]) => {
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

  loadData() {
    this.userService.getAllPaging(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((res: PaginatedResult<User[]>) => {
        this.users = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.notify.error('Có lỗi xảy ra');
        console.log('loadUsers: ' + error);
      });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadData();
  }
}
