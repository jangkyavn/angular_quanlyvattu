import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Material } from 'src/app/shared/models/material.model';
import { ImportMaterialDetail } from 'src/app/shared/models/import-material-detail.model';
import { Pagination } from 'src/app/shared/models/pagination.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

@Component({
  selector: 'app-search-detail',
  templateUrl: './search-detail.component.html',
  styleUrls: ['./search-detail.component.scss']
})
export class SearchDetailComponent implements OnInit, AfterViewInit {
  material: Material;
  importDetails: ImportMaterialDetail[];

  constructor(private route: ActivatedRoute,
    private utilities: UtilitiesService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.material = data['material'];
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.utilities.changeCollapsed(true);
    }, 0);
  }
}
