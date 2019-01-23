import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Material } from '../models/material.model';


@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.baseUrl + 'VatTu');
  }

  getDetail(id: number) {
    return this.http.get(this.baseUrl + 'VatTu/' + id);
  }

  addNew(material: Material) {
    return this.http.post(this.baseUrl + 'VatTu', material);
  }

  update(material: Material) {
    return this.http.put(this.baseUrl + 'VatTu', material);
  }
}
