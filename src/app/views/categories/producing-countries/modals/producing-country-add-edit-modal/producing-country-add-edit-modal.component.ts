import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';

import { ProducingCountryService } from 'src/app/shared/services/producing-country.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { ProducingCountry } from 'src/app/shared/models/producing-country.model';
import { noWhitespaceValidator } from 'src/app/shared/vailidators/no-whitespace-validator';

@Component({
  selector: 'app-producing-country-add-edit-modal',
  templateUrl: './producing-country-add-edit-modal.component.html',
  styleUrls: ['./producing-country-add-edit-modal.component.scss']
})
export class ProducingCountryAddEditModalComponent implements OnInit {
  @Input() producingCountry: ProducingCountry;
  @Input() isAddNew: boolean;

  producingCountryForm: FormGroup;

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && $event.keyCode === 13) {
      this.saveChanges();
    }
  }

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private producingCountryService: ProducingCountryService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.createForm();
    this.producingCountryForm.reset();
    this.producingCountryForm.patchValue(this.producingCountry);
  }

  createForm() {
    this.producingCountryForm = this.fb.group({
      maNuoc: [null],
      tenNuoc: [null, [Validators.required, noWhitespaceValidator]]
    });
  }

  saveChanges() {
    if (this.producingCountryForm.invalid) {
       // tslint:disable-next-line:forin
       for (const i in this.producingCountryForm.controls) {
        this.producingCountryForm.controls[i].markAsDirty();
        this.producingCountryForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const producingCountry = Object.assign({}, this.producingCountryForm.value);
    if (this.isAddNew) {
      this.producingCountryService.addNew(producingCountry).subscribe((res: any) => {
        if (typeof res === 'boolean') {
          if (res) {
            this.notify.success('Thêm thành công!');
            this.modal.destroy(true);
          }
        } else {
          if (res === -1) {
            this.notify.warning('Tên nước sản xuất đã tồn tại');
          }
        }
      }, error => {
        this.notify.success('Có lỗi xảy ra!');
        console.log('error addProducingCountry');
        this.modal.destroy(false);
      });
    } else {
      this.producingCountryService.update(producingCountry).subscribe((res: any) => {
        if (res) {
          this.notify.success('Sửa thành công!');
          this.modal.destroy(true);
        }
      }, error => {
        this.notify.success('Có lỗi xảy ra!');
        console.log('error updateProducingCountry');
        this.modal.destroy(false);
      });
    }
  }
}
