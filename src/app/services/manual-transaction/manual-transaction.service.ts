import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ManualTransaction } from '../../models/manual-transaction.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ManualTransactionService {
  private baseUrl = `${environment.apiUrl}/manual-transactions`;

  constructor(private http: HttpClient) {}

  getManualTransactions(): Observable<ManualTransaction[]> {
    return this.http.get<ManualTransaction[]>(this.baseUrl);
  }

  saveManualTransaction(
    transaction: ManualTransaction
  ): Observable<ManualTransaction> {
    return this.http.post<ManualTransaction>(this.baseUrl, transaction);
  }
}
