import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-user-view-detail-modal',
  templateUrl: './user-view-detail-modal.component.html',
  styleUrls: ['./user-view-detail-modal.component.scss']
})
export class UserViewDetailModalComponent implements OnInit {
  @Input() user: User;

  constructor() { }

  ngOnInit() {
  }
}
