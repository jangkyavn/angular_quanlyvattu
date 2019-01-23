import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MaterialItem } from '../models/material-item.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialItemService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.baseUrl + 'HangMucVatTu');
  }

  getDetail(id: number) {
    return this.http.get(this.baseUrl + 'HangMucVatTu/' + id);
  }

  addNew(materialItem: MaterialItem) {
    return this.http.post(this.baseUrl + 'HangMucVatTu', materialItem);
  }

  update(materialItem: MaterialItem) {
    return this.http.put(this.baseUrl + 'HangMucVatTu', materialItem);
  }
}
