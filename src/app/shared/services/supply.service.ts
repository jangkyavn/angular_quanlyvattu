import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Supply } from '../models/supply.model';

@Injectable({
  providedIn: 'root'
})
export class SupplyService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.baseUrl + 'NguonCungCap');
  }

  getDetail(id: number) {
    return this.http.get(this.baseUrl + 'NguonCungCap/' + id);
  }

  addNew(supply: Supply) {
    return this.http.post(this.baseUrl + 'NguonCungCap', supply);
  }

  update(supply: Supply) {
    return this.http.put(this.baseUrl + 'NguonCungCap', supply);
  }
}
