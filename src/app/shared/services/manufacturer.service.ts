import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Manufacturer } from '../models/manufacturer.model';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.baseUrl + 'HangSanXuat');
  }

  getDetail(id: number) {
    return this.http.get(this.baseUrl + 'HangSanXuat/' + id);
  }

  addNew(manufacturer: Manufacturer) {
    return this.http.post(this.baseUrl + 'HangSanXuat', manufacturer);
  }

  update(manufacturer: Manufacturer) {
    return this.http.put(this.baseUrl + 'HangSanXuat', manufacturer);
  }
}
