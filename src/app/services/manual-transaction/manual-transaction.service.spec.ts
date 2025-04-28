import { TestBed } from '@angular/core/testing';
import { ManualTransactionService } from './manual-transaction.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ManualTransaction } from '../../models/manual-transaction.model';
import { environment } from '../../../environments/environment';

describe('ManualTransactionService', () => {
  let service: ManualTransactionService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/manual-transactions`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ManualTransactionService],
    });

    service = TestBed.inject(ManualTransactionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch manual transactions', () => {
    const dummyTransactions: ManualTransaction[] = [
      {
        month: 4,
        year: 2025,
        entryNumber: 1,
        productCode: 'P001',
        cosifCode: 'COSIF123456',
        description: 'Test Desc 1',
        amount: 100,
      },
      {
        month: 5,
        year: 2025,
        entryNumber: 2,
        productCode: 'P002',
        cosifCode: 'COSIF123457',
        description: 'Test Desc 2',
        amount: 200,
      },
    ];

    service.getManualTransactions().subscribe((transactions) => {
      expect(transactions.length).toBe(2);
      expect(transactions).toEqual(dummyTransactions);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTransactions);
  });

  it('should save a manual transaction', () => {
    const transaction: ManualTransaction = {
      month: 4,
      year: 2025,
      entryNumber: 0,
      productCode: 'P003',
      cosifCode: 'COSIF123458',
      description: 'Save Test',
      amount: 300,
    };

    service.saveManualTransaction(transaction).subscribe((savedTransaction) => {
      expect(savedTransaction).toEqual(transaction);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(transaction);
    req.flush(transaction);
  });
});
