import { Component, Input } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-user-view-detail-modal',
  templateUrl: './user-view-detail-modal.component.html',
  styleUrls: ['./user-view-detail-modal.component.scss']
})
export class UserViewDetailModalComponent {
  @Input() user: User;

  constructor() { }

}
