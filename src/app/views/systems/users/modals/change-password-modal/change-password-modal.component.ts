import { Component, OnInit, HostListener, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';

import { UserService } from 'src/app/shared/services/user.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { checkChangePasswordConfirmValidator } from 'src/app/shared/vailidators/check-change-password-confirm-validator';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss']
})
export class ChangePasswordModalComponent implements OnInit {
  @Input() id: any;
  changePasswordForm: FormGroup;

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
  }

  createForm() {
    this.changePasswordForm = this.fb.group({
      newPassword: [null, [Validators.required]],
      confirmNewPassword: [null, [
        Validators.required,
        checkChangePasswordConfirmValidator
      ]]
    });
  }

  saveChanges() {
    if (this.changePasswordForm.invalid) {
      // tslint:disable-next-line:forin
      for (const key in this.changePasswordForm.controls) {
        this.changePasswordForm.controls[key].markAsDirty();
        this.changePasswordForm.controls[key].updateValueAndValidity();
      }
      return;
    }

    const { newPassword } = this.changePasswordForm.value;
    this.userService.changePasswordForOther(this.id, newPassword).subscribe((res: boolean) => {
      if (res) {
        this.notify.success('Thay đổi mật khẩu thành công');
        this.changePasswordForm.reset();
        this.modal.destroy(true);
      } else {
        this.modal.destroy(false);
      }
    }, _ => {
      console.log('error changePassword');
      this.notify.error('Có lỗi xảy ra');
      this.modal.destroy(false);
    });
  }
}
