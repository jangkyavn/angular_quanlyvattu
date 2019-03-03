import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Material } from 'src/app/shared/models/material.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

@Component({
  selector: 'app-search-material-detail',
  templateUrl: './search-material-detail.component.html',
  styleUrls: ['./search-material-detail.component.scss']
})
export class SearchMaterialDetailComponent implements OnInit, AfterViewInit {
  material: Material;

  constructor(private route: ActivatedRoute,
    private utilities: UtilitiesService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.material = data['search-material'];
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.utilities.changeCollapsed(true);
    }, 0);
  }
}
