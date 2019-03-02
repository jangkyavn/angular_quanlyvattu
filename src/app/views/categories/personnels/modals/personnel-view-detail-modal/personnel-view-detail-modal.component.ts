import { Component, Input } from '@angular/core';
import { Personnel } from 'src/app/shared/models/personnel.model';

@Component({
  selector: 'app-personnel-view-detail-modal',
  templateUrl: './personnel-view-detail-modal.component.html',
  styleUrls: ['./personnel-view-detail-modal.component.scss']
})
export class PersonnelViewDetailModalComponent {
  @Input() personnel: Personnel;

  constructor() { }

}
