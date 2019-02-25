import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  isCollapsed = new BehaviorSubject<boolean>(false);
  currentCollapsed = this.isCollapsed.asObservable();

  constructor() { }

  changeCollapsed(collapse: boolean) {
    this.isCollapsed.next(collapse);
  }
}
