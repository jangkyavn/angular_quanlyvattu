import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-404',
  templateUrl: './404.component.html',
  styleUrls: ['./404.component.scss']
})
export class P404Component {

  constructor(public location: Location) { }

}
