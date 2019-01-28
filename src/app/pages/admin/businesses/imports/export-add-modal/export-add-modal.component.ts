import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { Personnel } from 'src/app/shared/models/personnel.model';
import { Material } from 'src/app/shared/models/material.model';

import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { PersonnelService } from 'src/app/shared/services/personnel.service';
import { MaterialService } from 'src/app/shared/services/material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { ExportMaterialService } from 'src/app/shared/services/export-material.service';

@Component({
  selector: 'app-export-add-modal',
  templateUrl: './export-add-modal.component.html',
  styleUrls: ['./export-add-modal.component.scss']
})
export class ExportAddModalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
