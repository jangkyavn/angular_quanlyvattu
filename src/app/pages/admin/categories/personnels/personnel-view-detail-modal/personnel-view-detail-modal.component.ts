import { Component, OnInit, Input } from '@angular/core';
import { Personnel } from 'src/app/shared/models/personnel.model';

@Component({
  selector: 'app-personnel-view-detail-modal',
  templateUrl: './personnel-view-detail-modal.component.html',
  styleUrls: ['./personnel-view-detail-modal.component.scss']
})
export class PersonnelViewDetailModalComponent implements OnInit {
  @Input() personnel: Personnel;

  constructor() { }

  ngOnInit() {
  }

}
