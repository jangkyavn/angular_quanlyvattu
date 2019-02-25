import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Material } from 'src/app/shared/models/material.model';

@Component({
  selector: 'app-search-detail',
  templateUrl: './search-detail.component.html',
  styleUrls: ['./search-detail.component.scss']
})
export class SearchDetailComponent implements OnInit {
  material: Material;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.material = data['material'];
    });
  }
}
