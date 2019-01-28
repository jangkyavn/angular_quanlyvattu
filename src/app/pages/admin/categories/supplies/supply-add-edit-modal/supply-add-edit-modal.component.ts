import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { Supply } from 'src/app/shared/models/supply.model';
import { SupplyService } from 'src/app/shared/services/supply.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

@Component({
  selector: 'app-supply-add-edit-modal',
  templateUrl: './supply-add-edit-modal.component.html',
  styleUrls: ['./supply-add-edit-modal.component.scss']
})
export class SupplyAddEditModalComponent implements OnInit, AfterViewInit {
  @Output() saveEntity = new EventEmitter<boolean>();
  title: string;
  supply: Supply;
  submitted = false;

  isAddNew: boolean;

  supplyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private supplyService: SupplyService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  ngAfterViewInit() {
    this.supplyForm.reset();
    this.supplyForm.patchValue(this.supply);
  }

  createForm() {
    this.supplyForm = this.fb.group({
      maNguon: [null],
      tenNguon: [null, [Validators.required]],
      ghiChu: [null]
    });
  }

  saveChanges() {
    this.submitted = true;

    if (this.supplyForm.invalid) {
      return;
    }

    const supply = Object.assign({}, this.supplyForm.value);
    if (this.isAddNew) {
      this.supplyService.addNew(supply).subscribe((res: any) => {
        if (res) {
          this.saveEntity.emit(true);
          this.notify.success('Thêm thành công!');
          this.bsModalRef.hide();
        }
      }, error => {
        this.saveEntity.emit(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error addSupply');
      });
    } else {
      this.supplyService.update(supply).subscribe((res: any) => {
        if (res) {
          this.saveEntity.emit(true);
          this.notify.success('Sửa thành công!');
          this.bsModalRef.hide();
        }
      }, error => {
        this.saveEntity.emit(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error updateSupply');
      });
    }
  }

  hideModal() {
    if (this.supplyForm.dirty) {
      const result = confirm('Bạn có chắc chắn muốn tiếp tục không? Mọi sự thay đổi không lưu sẽ bị mất');
      if (result) {
        this.bsModalRef.hide();
      }
    } else {
      this.bsModalRef.hide();
    }
  }
}
