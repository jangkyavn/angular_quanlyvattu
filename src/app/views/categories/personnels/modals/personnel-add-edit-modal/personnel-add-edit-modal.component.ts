import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';

import { PersonnelService } from 'src/app/shared/services/personnel.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { Personnel } from 'src/app/shared/models/personnel.model';
import { noWhitespaceValidator } from 'src/app/shared/vailidators/no-whitespace-validator';

@Component({
  selector: 'app-personnel-add-edit-modal',
  templateUrl: './personnel-add-edit-modal.component.html',
  styleUrls: ['./personnel-add-edit-modal.component.scss']
})
export class PersonnelAddEditModalComponent implements OnInit {
  @Input() personnel: Personnel;
  @Input() isAddNew: boolean;
  cities: any[];
  districts: any[];
  nations: any[];

  personnelForm: FormGroup;

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && $event.keyCode === 13) {
      this.saveChanges();
    }
  }

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private personnelService: PersonnelService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.loadNations();

    this.createForm();
    this.personnelForm.reset();

    if (!this.isAddNew) { // Sửa
      const address = this.personnel.queQuan.split(',');
      this.loadDetailAddress(address);
      this.personnelForm.patchValue({
        ...this.personnel,
        danToc: parseInt(this.personnel.danToc, 0)
      });
    } else { // Thêm mới
      this.loadCities();

      this.personnelForm.patchValue(this.personnel);
    }
  }

  createForm() {
    this.personnelForm = this.fb.group({
      maNS: [null],
      hoTen: [null, [Validators.required, noWhitespaceValidator]],
      ngaySinh: [null, [Validators.required]],
      queQuan: [null],
      danToc: [null, [Validators.required]],
      tonGiao: [null],
      capBacSHSQ: [null],
      chucVu: [null],
      ngayNhapNguTuyenDung: [null],
      dang: [null],
      xuatThan: [null],
      banThan: [null],
      quaTrinhHocTap: [null],
      thanNhan: [null],
      ghiChu: [null],
      tinhThanhPho: [null, [Validators.required]],
      huyenQuan: [null, [Validators.required]]
    });
  }

  saveChanges() {
    console.log(this.personnelForm.value);

    if (this.personnelForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.personnelForm.controls) {
        this.personnelForm.controls[i].markAsDirty();
        this.personnelForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const personnel: Personnel = Object.assign({}, this.personnelForm.value);
    personnel.queQuan = personnel.huyenQuan + ',' + personnel.tinhThanhPho;

    if (this.isAddNew) {
      this.personnelService.addNew(personnel).subscribe((res: any) => {
        if (typeof res === 'boolean') {
          if (res) {
            this.notify.success('Thêm thành công!');
            this.modal.destroy(true);
          }
        } else {
          if (res === -1) {
            this.notify.warning('Tên nhân sự đã tồn tại');
          }
        }
      });
    } else {
      this.personnelService.update(personnel).subscribe((res: any) => {
        if (res) {
          this.notify.success('Sửa thành công!');
          this.modal.destroy(true);
        }
      });
    }
  }

  loadCities() {
    this.personnelService.getCities().subscribe((res: any[]) => {
      this.cities = res;
    });
  }

  changeCities(data: any) {
    this.personnelForm.patchValue({
      huyenQuan: null
    });

    if (data !== null && data !== undefined) {
      this.personnelService.getDistrict(data).subscribe((res: any[]) => {
        this.districts = res;
      });
    } else {
      const cHuyenQuan = this.personnelForm.get('huyenQuan');
      cHuyenQuan.setValue(null);
      this.personnelForm.updateValueAndValidity();
    }
  }

  loadNations() {
    this.personnelService.getNations().subscribe((res: any[]) => {
      this.nations = res;
    });
  }

  loadDetailAddress(address: any[]) {
    this.personnelService.getCities().subscribe((res: any[]) => {
      this.cities = res;
      this.personnelForm.patchValue({
        tinhThanhPho: parseInt(address[1], 0)
      });
    }, _ => {
      console.log('error LoadDetailAddress');
    }, () => {
      this.personnelService.getDistrict(parseInt(address[1], 0)).subscribe((res: any[]) => {
        this.districts = res;
        this.personnelForm.patchValue({
          huyenQuan: parseInt(address[0], 0)
        });
      });
    });
  }
}
