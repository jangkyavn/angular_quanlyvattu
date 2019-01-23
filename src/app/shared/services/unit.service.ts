import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Unit } from '../models/unit.model';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.baseUrl + 'DonViTinh');
  }

  getDetail(id: number) {
    return this.http.get(this.baseUrl + 'DonViTinh/' + id);
  }

  addNew(unit: Unit) {
    return this.http.post(this.baseUrl + 'DonViTinh', unit);
  }

  update(unit: Unit) {
    return this.http.put(this.baseUrl + 'DonViTinh', unit);
  }
}
