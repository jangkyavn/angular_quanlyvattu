import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UtilitiesService } from 'src/app/shared/services/utilities.service';

import { Material } from 'src/app/shared/models/material.model';

@Component({
  selector: 'app-general-statistic-detail',
  templateUrl: './general-statistic-detail.component.html',
  styleUrls: ['./general-statistic-detail.component.scss']
})
export class GeneralStatisticDetailComponent implements OnInit, AfterViewInit {
  material: Material;
  fromDate: string;
  toDate: string;
  tonDauKy: number;
  tonCuoiKy: number;

  constructor(private route: ActivatedRoute,
    private utilities: UtilitiesService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.material = data['material-statistic-detail'];

      this.route.queryParams.subscribe(params => {
        this.fromDate = params['fromDate'];
        this.toDate = params['toDate'];
        this.tonDauKy = params['tonDauKy'];
        this.tonCuoiKy = params['tonCuoiKy'];
      });
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.utilities.changeCollapsed(true);
    }, 0);
  }
}
