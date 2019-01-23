import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  confirmModal: NzModalRef;

  constructor(private messageService: NzMessageService,
    private modal: NzModalService) { }

  success(message: string) {
    this.messageService.create('success', message);
  }

  error(message: string) {
    this.messageService.create('error', message);
  }

  warning(message: string) {
    this.messageService.create('warning', message);
  }

  info(message: string) {
    this.messageService.create('info', message);
  }

  confirm(message: string, okCallBack: () => any) {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Thông báo',
      nzContent: message,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Hủy bỏ',
      nzOnOk: () => {
        okCallBack();
      }
    });
  }
}
