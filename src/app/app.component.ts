import { Component, OnInit } from '@angular/core';
import { ConnectionService } from 'ng-connection-service';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isConnected = true;

  constructor(
    private spinner: NgxSpinnerService,
    private connectionService: ConnectionService) { }

  ngOnInit() {
    if (navigator.onLine) {
      this.spinner.hide();
    } else {
      this.spinner.show();
    }

    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.spinner.hide();
      } else {
        this.spinner.show();
      }
    });
  }
}
