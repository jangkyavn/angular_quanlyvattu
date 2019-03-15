import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { Router } from '@angular/router';

import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  isCollapsed = new BehaviorSubject<boolean>(false);
  isShowModal = new BehaviorSubject<boolean>(false);
  currentCollapsed = this.isCollapsed.asObservable();
  currentShowModal = this.isShowModal.asObservable();

  constructor(private router: Router,
    private notify: NotifyService) { }

  changeCollapsed(collapse: boolean) {
    this.isCollapsed.next(collapse);
  }

  showModal(isShow: boolean) {
    this.isShowModal.next(isShow);
  }

  handleError(error, message) {
    if (error.status === 401) {
      this.notify.warning('Bạn không có quyền');
      this.router.navigate(['/']);
    } else {
      this.notify.error('Có lỗi xảy ra');
    }
    console.log(`error ${message}`);
    return of(null);
  }
}
