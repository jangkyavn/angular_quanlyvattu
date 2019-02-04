import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  tabs = [];
  nzTabPosition = 'top';
  selectedIndex = 0;

  constructor() { }

  ngOnInit() {
    for (let i = 0; i < 11; i++) {
      this.tabs.push({
        name   : `Tab ${i}`,
        content: `Content of tab ${i}`
      });
    }
  }

  log(args: any[]): void {
    console.log(args);
  }
}
