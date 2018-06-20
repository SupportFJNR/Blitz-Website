import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import { ReservationPackage } from '../models/reservationPackage';

@Injectable()
export class ReservationPackageService extends GlobalService {

  url_reservationPackages = environment.url_base_api + environment.paths_api.reservationPackages;

  constructor(public http: HttpClient) {
    super();
  }

  create(reservationPackage: ReservationPackage): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_reservationPackages,
      reservationPackage,
      {headers: headers}
    );
  }

  list(limit = 100, offset = 0): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('limit', limit.toString());
    params = params.set('offset', offset.toString());
    return this.http.get<any>(
      this.url_reservationPackages,
      {headers: headers, params: params}
    );
  }

  get(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_reservationPackages + '/' + id,
      {headers: headers}
    );
  }

  update(url: string, reservationPackage: ReservationPackage): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch<any>(
      url,
      reservationPackage,
      {headers: headers}
    );
  }

  remove(reservationPackage: ReservationPackage): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      reservationPackage.url,
      {headers: headers}
    );
  }
}
