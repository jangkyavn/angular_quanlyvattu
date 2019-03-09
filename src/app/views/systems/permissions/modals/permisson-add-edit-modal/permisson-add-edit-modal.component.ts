import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';

import { RoleService } from 'src/app/shared/services/role.service';
import { FunctionService } from 'src/app/shared/services/function.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { Role } from 'src/app/shared/models/role.model';
import { Function } from 'src/app/shared/models/function.model';
import { Permission } from 'src/app/shared/models/permission.model';
import { checkRoleNameDuplicateValidator } from 'src/app/shared/vailidators/check-role-name-duplicate-validator';
import { noWhitespaceValidator } from 'src/app/shared/vailidators/no-whitespace-validator';

@Component({
  selector: 'app-permisson-add-edit-modal',
  templateUrl: './permisson-add-edit-modal.component.html',
  styleUrls: ['./permisson-add-edit-modal.component.scss']
})
export class PermissonAddEditModalComponent implements OnInit {
  @Input() role: Role;
  @Input() isAddNew: boolean;
  functions: Function[] = [];
  roleForm: FormGroup;
  check = true;

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && $event.keyCode === 13) {
      this.saveChanges();
    }
  }

  constructor(private fb: FormBuilder,
    private modal: NzModalRef,
    private roleService: RoleService,
    private functionService: FunctionService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.loadAllFunctions();
    this.createForm();
    this.roleForm.reset();
    this.roleForm.patchValue(this.role);
  }

  createForm() {
    if (this.isAddNew) {
      this.roleForm = this.fb.group({
        id: [null],
        name: [null, [Validators.required, noWhitespaceValidator],
          [checkRoleNameDuplicateValidator(this.roleService, '')]
        ]
      });
    } else {
      this.roleForm = this.fb.group({
        id: [null],
        name: [null, [Validators.required, noWhitespaceValidator],
          [checkRoleNameDuplicateValidator(this.roleService, this.role.name)]
        ]
      });
    }
  }

  loadAllFunctions() {
    this.functionService.getAll().subscribe((res: Function[]) => {
      this.functions = res;
      if (this.isAddNew === false) {
        this.fillPermissions(this.role.id);
      }
    });
  }

  saveChanges() {
    if (this.roleForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.roleForm.controls) {
        this.roleForm.controls[i].markAsDirty();
        this.roleForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const permissons: Permission[] = [];
    this.functions.forEach((item: Function) => {
      if (item.read) {
        permissons.push({
          maVaiTro: this.role.id,
          maChucNang: item.maChucNang,
          maHanhDong: 'READ'
        });
      }
      if (item.create) {
        permissons.push({
          maVaiTro: this.role.id,
          maChucNang: item.maChucNang,
          maHanhDong: 'CREATE'
        });
      }
      if (item.update) {
        permissons.push({
          maVaiTro: this.role.id,
          maChucNang: item.maChucNang,
          maHanhDong: 'UPDATE'
        });
      }
      if (item.delete) {
        permissons.push({
          maVaiTro: this.role.id,
          maChucNang: item.maChucNang,
          maHanhDong: 'DELETE'
        });
      }
    });

    const role: Role = Object.assign({}, this.roleForm.value);
    role.phanQuyens = permissons;

    if (this.isAddNew) {
      this.roleService.addNew(role).subscribe((res: any) => {
        if (res) {
          this.notify.success('Thêm mới thành công!');
          this.modal.destroy(true);
        }
      }, error => {
        this.notify.error('Có lỗi xảy ra!');
        console.log('error addRole');
        this.modal.destroy(false);
      });
    } else {
      this.roleService.update(role).subscribe((res: any) => {
        if (res) {
          this.notify.success('Sửa thành công!');
          this.modal.destroy(true);
        }
      }, error => {
        this.notify.error('Có lỗi xảy ra!');
        console.log('error updateRole');
        this.modal.destroy(false);
      });
    }
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
}
