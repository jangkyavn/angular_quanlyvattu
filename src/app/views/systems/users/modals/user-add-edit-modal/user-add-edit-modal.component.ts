import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NzModalRef } from 'ng-zorro-antd';

import { UserService } from 'src/app/shared/services/user.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { User } from 'src/app/shared/models/user.model';

import { passwordMatchValidator } from 'src/app/shared/vailidators/password-match-validator';
import { checkUsernameDuplicateValidator } from 'src/app/shared/vailidators/check-username-duplicate-validator';
import { checkEmailDuplicateValidator } from 'src/app/shared/vailidators/check-email-duplicate-validator';
import { noWhitespaceValidator } from 'src/app/shared/vailidators/no-whitespace-validator';

@Component({
  selector: 'app-user-add-edit-modal',
  templateUrl: './user-add-edit-modal.component.html',
  styleUrls: ['./user-add-edit-modal.component.scss']
})
export class UserAddEditModalComponent implements OnInit {
  @Input() user: User;
  @Input() isAddNew: boolean;
  userForm: FormGroup;

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && $event.keyCode === 13) {
      this.saveChanges();
    }
  }

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private userService: UserService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.createForm();
    this.userForm.reset();

    if (this.isAddNew) {
      this.userForm.patchValue(this.user);
    } else {
      this.userForm.patchValue({
        ...this.user,
        dateOfBirth: this.user.dateOfBirth.substring(0, this.user.dateOfBirth.indexOf('T'))
      });
    }
  }

  createForm() {
    if (this.isAddNew) {
      this.userForm = this.fb.group({
        id: [null],
        userName: [null, [
          Validators.required,
          Validators.maxLength(20),
          noWhitespaceValidator
        ], [checkUsernameDuplicateValidator(this.userService)]],
        password: [null, [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12),
          noWhitespaceValidator]
        ],
        confirmPassword: [null, [
          Validators.required,
          passwordMatchValidator,
          noWhitespaceValidator
        ]],
        fullName: [null, [
          Validators.required,
          Validators.maxLength(50),
          noWhitespaceValidator
        ]],
        email: [null, [
          Validators.required,
          Validators.email,
          Validators.maxLength(50),
          noWhitespaceValidator
        ], [checkEmailDuplicateValidator(this.userService, '')]],
        gender: [null, [Validators.required]],
        dateOfBirth: [null, [Validators.required]]
      });
    } else {
      this.userForm = this.fb.group({
        id: [null],
        userName: [{ value: null, disabled: true }, [
          Validators.required,
          Validators.maxLength(20),
          noWhitespaceValidator
        ]],
        fullName: [null, [
          Validators.required,
          Validators.maxLength(50),
          noWhitespaceValidator
        ]],
        email: [null, [
          Validators.required,
          Validators.email,
          Validators.maxLength(50),
          noWhitespaceValidator
        ], [checkEmailDuplicateValidator(this.userService, this.user.email)]],
        gender: [null, [Validators.required]],
        dateOfBirth: [null, [Validators.required]]
      });
    }
  }

  saveChanges() {
    if (this.userForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.userForm.controls) {
        this.userForm.controls[i].markAsDirty();
        this.userForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const user = Object.assign({}, this.userForm.getRawValue());
    if (this.isAddNew) {
      this.userService.addNew(user).subscribe((res: any) => {
        if (res) {
          this.notify.success('Thêm mới thành công!');
          this.modal.destroy(true);
        }
      }, error => {
        this.notify.error('Có lỗi xảy ra!');
        console.log('error addUser');
        this.modal.destroy(false);
      });
    } else {
      this.userService.update(user).subscribe((res: any) => {
        if (res) {
          this.notify.success('Sửa thành công!');
          this.modal.destroy(true);
        }
      }, error => {
        this.notify.error('Có lỗi xảy ra!');
        console.log('error updateUser');
        this.modal.destroy(false);
      });
    }
  }
}
