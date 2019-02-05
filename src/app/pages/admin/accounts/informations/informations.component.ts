import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { UserService } from '../../../../shared/services/user.service';
import { NotifyService } from '../../../../shared/services/notify.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.scss']
})
export class InformationsComponent implements OnInit {
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
      phoneNumber: [null],
      avatar: [null],
      address: [null]
    });

    this.userService.getDetail(this.authService.decodedToken.nameid)
      .subscribe((res: User) => {
        this.accountInformationForm.patchValue({
          ...res,
          dateOfBirth: res.dateOfBirth.substring(0, res.dateOfBirth.indexOf('T'))
        });
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

  allowDrop(e) {
    e.preventDefault();
  }

  drop(e) {
    e.preventDefault();
    this.readfiles(e.dataTransfer.files);
  }

  readfiles(files) {
    if (files && files[0]) {
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent) => {
        this.avatarUrl = (<FileReader>event.target).result;
      };

      reader.readAsDataURL(files[0]);
    }
  }

  changeFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent) => {
        const img = new Image;
        img.src = reader.result + '';
        img.onload = () => {
          if (img.width > 200 && img.height > 200) {
            alert('Ảnh tải lên không vượt quá kích thước 200x200');
          } else {
            this.avatarUrl = img.src;
          }
        };
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  resetAvatar() {
    this.avatarUrl = '';
    this.fAvatar.nativeElement.value = null;
  }
}
