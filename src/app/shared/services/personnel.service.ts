import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Personnel } from '../models/personnel.model';

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.baseUrl + 'NhanSu');
  }

  getDetail(id: number) {
    return this.http.get(this.baseUrl + 'NhanSu/' + id);
  }

  addNew(personnel: Personnel) {
    return this.http.post(this.baseUrl + 'NhanSu', personnel);
  }

  update(personnel: Personnel) {
    return this.http.put(this.baseUrl + 'NhanSu', personnel);
  }
}
