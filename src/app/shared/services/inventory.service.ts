import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Inventory } from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.baseUrl + 'KhoHang');
  }

  getDetail(id: number) {
    return this.http.get(this.baseUrl + 'KhoHang/' + id);
  }

  getTotalCount() {
    return this.http.get(this.baseUrl + 'KhoHang/getTotalCount');
  }
}
