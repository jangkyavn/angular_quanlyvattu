import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Personnel } from 'src/app/shared/models/personnel.model';
import { PersonnelService } from 'src/app/shared/services/personnel.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

@Component({
  selector: 'app-personnel-add-edit-modal',
  templateUrl: './personnel-add-edit-modal.component.html',
  styleUrls: ['./personnel-add-edit-modal.component.scss']
})
export class PersonnelAddEditModalComponent implements OnInit {
  @Input() personnel: Personnel;
  @Input() isAddNew: boolean;

  personnelForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private personnelService: PersonnelService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.createForm();
    this.personnelForm.reset();
    this.personnelForm.patchValue(this.personnel);
  }

  createForm() {
    this.personnelForm = this.fb.group({
      maNS: [null],
      hoTen: [null, [Validators.required]],
      ngaySinh: [null, [Validators.required]],
      queQuan: [null, [Validators.required]],
      danToc: [null, [Validators.required]],
      tonGiao: [null],
      capBacSHSQ: [null],
      chucVu: [null],
      ngayNhapNguTuyenDung: [null],
      xuatThan: [null],
      banThan: [null],
      quaTrinhHocTap: [null],
      thanNhan: [null],
      ghiChu: [null]
    });
  }

  saveChanges(callBack: (result: boolean) => any = null) {
    if (this.personnelForm.invalid) {
       // tslint:disable-next-line:forin
       for (const i in this.personnelForm.controls) {
        this.personnelForm.controls[i].markAsDirty();
        this.personnelForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const personnel = Object.assign({}, this.personnelForm.value);
    if (this.isAddNew) {
      this.personnelService.addNew(personnel).subscribe((res: any) => {
        if (res) {
          this.notify.success('Thêm thành công!');
          callBack(true);
        }
      }, error => {
        this.notify.success('Có lỗi xảy ra!');
        console.log('error addPersonnel');
        callBack(false);
      });
    } else {
      this.personnelService.update(personnel).subscribe((res: any) => {
        if (res) {
          this.notify.success('Sửa thành công!');
          callBack(true);
        }
      }, error => {
        this.notify.success('Có lỗi xảy ra!');
        console.log('error updatePersonnel');
        callBack(false);
      });
    }
  }
}
