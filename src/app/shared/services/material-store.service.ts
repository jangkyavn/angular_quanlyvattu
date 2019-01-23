import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MaterialStore } from '../models/material-store.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialStoreService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.baseUrl + 'KhoVatTu');
  }

  getDetail(id: number) {
    return this.http.get(this.baseUrl + 'KhoVatTu/' + id);
  }

  addNew(materialStore: MaterialStore) {
    return this.http.post(this.baseUrl + 'KhoVatTu', materialStore);
  }

  update(materialStore: MaterialStore) {
    return this.http.put(this.baseUrl + 'KhoVatTu', materialStore);
  }
}
