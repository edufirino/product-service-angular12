import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductCosif } from '../../models/product-cosif.model';

@Injectable({
  providedIn: 'root',
})
export class ProductCosifService {
  private baseUrl = `${environment.apiUrl}/products-cosif`;

  constructor(private http: HttpClient) {}

  getProductCosifs(): Observable<any[]> {
    return this.http.get<ProductCosif[]>(this.baseUrl);
  }
}
