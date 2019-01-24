import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { ProducingCountry } from 'src/app/shared/models/producing-country.model';
import { ProducingCountryService } from 'src/app/shared/services/producing-country.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

@Component({
  selector: 'app-producing-country-add-edit-modal',
  templateUrl: './producing-country-add-edit-modal.component.html',
  styleUrls: ['./producing-country-add-edit-modal.component.scss']
})
export class ProducingCountryAddEditModalComponent implements OnInit, AfterViewInit {
  @Output() saveEntity = new EventEmitter<boolean>();
  title: string;
  producingCountry: ProducingCountry;

  isAddNew: boolean;

  producingCountryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private producingCountryService: ProducingCountryService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  ngAfterViewInit() {
    this.producingCountryForm.reset();
    this.producingCountryForm.patchValue(this.producingCountry);
  }

  createForm() {
    this.producingCountryForm = this.fb.group({
      maNuoc: [null],
      tenNuoc: [null, [Validators.required]]
    });
  }

  saveChanges() {
    const producingCountry = Object.assign({}, this.producingCountryForm.value);
    if (this.isAddNew) {
      this.producingCountryService.addNew(producingCountry).subscribe((res: any) => {
        if (res) {
          this.saveEntity.emit(true);
          this.notify.success('Thêm thành công!');
          this.bsModalRef.hide();
        }
      }, error => {
        this.saveEntity.emit(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error addProducingCountry');
      });
    } else {
      this.producingCountryService.update(producingCountry).subscribe((res: any) => {
        if (res) {
          this.saveEntity.emit(true);
          this.notify.success('Sửa thành công!');
          this.bsModalRef.hide();
        }
      }, error => {
        this.saveEntity.emit(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error updateProducingCountry');
      });
    }
  }

  hideModal() {
    if (this.producingCountryForm.dirty) {
      const result = confirm('Bạn có chắc chắn muốn tiếp tục không? Mọi sự thay đổi không lưu sẽ bị mất');
      if (result) {
        this.bsModalRef.hide();
      }
    } else {
      this.bsModalRef.hide();
    }
  }
}
