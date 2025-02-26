import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  http = inject(HttpClient);
  apiUrl = 'http://localhost:8080/vehicles';

  constructor() {
    this.http.get('http://localhost:8080/vehicles');
  }
}
