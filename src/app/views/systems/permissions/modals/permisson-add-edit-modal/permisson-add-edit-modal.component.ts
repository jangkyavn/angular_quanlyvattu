import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';

import { RoleService } from 'src/app/shared/services/role.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { Role } from 'src/app/shared/models/role.model';
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
  roleForm: FormGroup;

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && $event.keyCode === 13) {
      this.saveChanges();
    }
  }

  constructor(private fb: FormBuilder,
    private modal: NzModalRef,
    private roleService: RoleService,
    private notify: NotifyService) { }

  ngOnInit() {
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

  saveChanges() {
    if (this.roleForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.roleForm.controls) {
        this.roleForm.controls[i].markAsDirty();
        this.roleForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const role = Object.assign({}, this.roleForm.value);
    if (this.isAddNew) {
      this.roleService.addNew(role).subscribe((res: any) => {
        if (res) {
          this.notify.success('Thêm mới thành công!');
          this.modal.destroy(true);
        }
      }, error => {
        this.notify.success('Có lỗi xảy ra!');
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
        this.notify.success('Có lỗi xảy ra!');
        console.log('error updateRole');
        this.modal.destroy(false);
      });
    }
  }
}
