import { Component, OnInit, AfterViewInit, Input, HostListener } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Supply } from 'src/app/shared/models/supply.model';
import { SupplyService } from 'src/app/shared/services/supply.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-supply-add-edit-modal',
  templateUrl: './supply-add-edit-modal.component.html',
  styleUrls: ['./supply-add-edit-modal.component.scss']
})
export class SupplyAddEditModalComponent implements OnInit {
  @Input() supply: Supply;
  @Input() isAddNew: boolean;

  supplyForm: FormGroup;

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && $event.keyCode === 13) {
      this.saveChanges();
    }
  }

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private supplyService: SupplyService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.createForm();
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
    if (this.supplyForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.supplyForm.controls) {
        this.supplyForm.controls[i].markAsDirty();
        this.supplyForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const supply = Object.assign({}, this.supplyForm.value);
    if (this.isAddNew) {
      this.supplyService.addNew(supply).subscribe((res: any) => {
        if (typeof res === 'boolean') {
          if (res) {
            this.notify.success('Thêm thành công!');
            this.modal.destroy(true);
          } else {
            console.log('add Supply failed');
          }
        } else {
          if (res === -1) {
            this.notify.warning('Tên nguồn cung cấp đã tồn tại');
          }
        }
      }, error => {
        this.modal.destroy(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error addSupply');
      });
    } else {
      this.supplyService.update(supply).subscribe((res: any) => {
        if (res) {
          this.modal.destroy(true);
          this.notify.success('Sửa thành công!');
        } else {
          console.log('update Supply failed');
        }
      }, error => {
        this.modal.destroy(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error updateSupply');
      });
    }
  }
}
