import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProducingCountry } from '../models/producing-country.model';

@Injectable({
  providedIn: 'root'
})
export class ProducingCountryService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.baseUrl + 'NuocSanXuat');
  }

  getDetail(id: number) {
    return this.http.get(this.baseUrl + 'NuocSanXuat/' + id);
  }

  addNew(producingCountry: ProducingCountry) {
    return this.http.post(this.baseUrl + 'NuocSanXuat', producingCountry);
  }

  update(producingCountry: ProducingCountry) {
    return this.http.put(this.baseUrl + 'NuocSanXuat', producingCountry);
  }
}
