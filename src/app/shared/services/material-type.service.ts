import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MaterialType } from '../models/material-type.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialTypeService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.baseUrl + 'LoaiVatTu');
  }

  getDetail(id: number) {
    return this.http.get(this.baseUrl + 'LoaiVatTu/' + id);
  }

  getAllByItemId(itemId: number) {
    return this.http.get(this.baseUrl + 'LoaiVatTu/getListLoaiByMaHM/' + itemId);
  }

  addNew(materialType: MaterialType) {
    return this.http.post(this.baseUrl + 'LoaiVatTu', materialType);
  }

  update(materialType: MaterialType) {
    return this.http.put(this.baseUrl + 'LoaiVatTu', materialType);
  }
}
