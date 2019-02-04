import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { UserService } from '../../../../shared/services/user.service';
import { NotifyService } from '../../../../shared/services/notify.service';
import { AuthService } from 'src/app/shared/services/auth.service';

import { checkCurrentPasswordValidator } from 'src/app/shared/vailidators/check-current-password-validator';
import { checkChangePasswordConfirmValidator } from 'src/app/shared/vailidators/check-change-password-confirm-validator';
import { checkNewPasswordValidator } from 'src/app/shared/vailidators/check-new-password-validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  submitted = false;
  isLoading: boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.changePasswordForm = this.fb.group({
      currentPassword: [null, [Validators.required], [
        checkCurrentPasswordValidator(this.userService)
      ]],
      newPassword: [null, [
        Validators.required,
        checkNewPasswordValidator
      ]],
      confirmNewPassword: [null, [
        Validators.required,
        checkChangePasswordConfirmValidator
      ]]
    });
  }

  saveChanges() {
    this.isLoading = true;
    this.submitted = true;

    if (this.changePasswordForm.invalid) {
      this.isLoading = false;
      return;
    }

    const { newPassword } = this.changePasswordForm.value;
    this.userService.changePassword(newPassword).subscribe((res: boolean) => {
      if (res) {
        this.notify.success('Thay mật khẩu thành công');
        this.submitted = false;
        this.isLoading = false;
        this.changePasswordForm.reset();
        this.notify.confirm('Vui lòng đăng xuất để sử dụng mật khẩu mới!', () => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.authService.decodedToken = null;
          this.authService.currentUser = null;
          this.router.navigate(['/']);
        }, 'Đăng xuất', 'Để sau');
      }
    }, _ => {
      console.log('error changePassword');
      this.notify.error('Có lỗi xảy ra');
    });
  }
}
