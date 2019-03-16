import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Material } from 'src/app/shared/models/material.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

@Component({
  selector: 'app-search-material-detail',
  templateUrl: './search-material-detail.component.html',
  styleUrls: ['./search-material-detail.component.scss']
})
export class SearchMaterialDetailComponent implements OnInit, AfterViewInit {
  material: Material;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private notify: NotifyService,
    private utilities: UtilitiesService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      const result = data['check-permission-read'];
      if (!result) {
        this.router.navigate(['/']);
        this.notify.warning('Bạn không có quyền');
      }

      this.material = data['search-material'];
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.utilities.changeCollapsed(true);
    }, 0);
  }
}
