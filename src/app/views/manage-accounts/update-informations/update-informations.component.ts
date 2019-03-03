import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { UserService } from 'src/app/shared/services/user.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { AuthService } from 'src/app/shared/services/auth.service';

import { User } from 'src/app/shared/models/user.model';
import { checkEmailDuplicateValidator } from 'src/app/shared/vailidators/check-email-duplicate-validator';

@Component({
  selector: 'app-update-informations',
  templateUrl: './update-informations.component.html',
  styleUrls: ['./update-informations.component.scss']
})
export class UpdateInformationsComponent implements OnInit {
  accountInformationForm: FormGroup;
  isLoading: boolean;
  avatarUrl: any;
  @ViewChild('avatar') avatar: ElementRef;
  @ViewChild('fAvatar') fAvatar: ElementRef;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.accountInformationForm = this.fb.group({
      id: [null],
      userName: [{ value: null, disabled: true }, [Validators.required]],
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      gender: [null, [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      phoneNumber: [null, [Validators.pattern('[0-9]+')]],
      avatar: [null],
      address: [null]
    });

    this.userService.getDetail(this.authService.decodedToken.nameid)
      .subscribe((res: User) => {
        this.accountInformationForm.patchValue({
          ...res,
          dateOfBirth: res.dateOfBirth.substring(0, res.dateOfBirth.indexOf('T'))
        });

        const email = this.accountInformationForm.get(`email`);
        email.setAsyncValidators(checkEmailDuplicateValidator(this.userService, res.email));
        email.updateValueAndValidity();
      });
  }

  saveChanges() {
    this.isLoading = true;
    if (this.accountInformationForm.invalid) {
      // tslint:disable-next-line:forin
      for (const key in this.accountInformationForm.controls) {
        this.accountInformationForm.controls[key].markAsDirty();
        this.accountInformationForm.controls[key].updateValueAndValidity();
      }
      this.isLoading = false;
      return;
    } else {
      const user = Object.assign({}, this.accountInformationForm.getRawValue());
      this.userService.update(user).subscribe((res) => {
        if (res) {
          this.notify.success('Cập nhật thành công');
          this.isLoading = false;

          this.accountInformationForm.markAsPristine();
          this.accountInformationForm.updateValueAndValidity();
        }
      }, _ => {
        console.log('error updateAccount');
        this.notify.error('Có lỗi xảy ra');
        this.isLoading = false;
      });
    }
  }
}
