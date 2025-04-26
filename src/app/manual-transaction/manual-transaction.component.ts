// File: C:\dev\projects\product-service-angular\src\app\manual-transaction\manual-transaction.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ManualTransactionService } from '../services/manual-transaction/manual-transaction.service';
import { ProductService } from '../services/product/product.service';
import { ProductCosifService } from '../services/product-cosif/product-cosif.service';

import { ManualTransaction } from '../models/manual-transaction.model';
import { Product } from '../models/product.model';
import { ProductCosif } from '../models/product-cosif.model';

@Component({
  selector: 'app-manual-transaction',
  templateUrl: './manual-transaction.component.html',
  styleUrls: ['./manual-transaction.component.css']
})
export class ManualTransactionComponent implements OnInit {
  transactionForm!: FormGroup;
  manualTransactions: ManualTransaction[] = [];
  products: Product[] = [];
  productCosifs: ProductCosif[] = [];
  filteredCosifs: ProductCosif[] = [];

  months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: new Date(0, i).toLocaleString('default', { month: 'long' }) }));
  displayedColumns = ['month', 'year', 'productCode', 'productDescription', 'entryNumber', 'description', 'amount'];

  serverYearError = '';
  saveEnabled = false;

  constructor(
    private fb: FormBuilder,
    private transactionService: ManualTransactionService,
    private productService: ProductService,
    private productCosifService: ProductCosifService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
    this.toggleFormControls(false);
  }

  private initForm(): void {
    this.transactionForm = this.fb.group({
      month: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1800), Validators.max(3000)]],
      productCode: ['', Validators.required],
      cosifCode: [{ value: '', disabled: true }, Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required]
    });

    this.transactionForm.valueChanges.subscribe(() => {
      this.transactionForm.markAllAsTouched();
      this.saveEnabled = this.transactionForm.valid && !!this.transactionForm.get('cosifCode')?.value;
    });
  }

  private loadData(): void {
    this.transactionService.getManualTransactions().subscribe(data => this.manualTransactions = data);
    this.productService.getProducts().subscribe(data => this.products = data);
    this.productCosifService.getProductCosifs().subscribe(data => this.productCosifs = data);
  }

  onNewTransaction(): void {
    this.serverYearError = '';
    this.transactionForm.reset();
    this.filteredCosifs = [];
    this.toggleFormControls(true);
    this.toggleControl('cosifCode', false);
    this.saveEnabled = true;
  }

  onProductChange(): void {
    const productCode = this.transactionForm.get('productCode')?.value;
    const cosifControl = this.transactionForm.get('cosifCode');

    cosifControl?.reset('');
    cosifControl?.disable();

    this.filteredCosifs = this.productCosifs.filter(c => c.productCode === productCode);
    const hasCosifs = this.filteredCosifs.length > 0;

    if (hasCosifs) cosifControl?.enable();

    cosifControl?.updateValueAndValidity();
    this.saveEnabled = hasCosifs && this.transactionForm.valid;
  }

  onCosifChange(): void {
    const cosifValue = this.transactionForm.get('cosifCode')?.value;
    const isValid = !!cosifValue;

    this.toggleControl('cosifCode', isValid);
    this.transactionForm.get('cosifCode')?.updateValueAndValidity();

    this.saveEnabled = isValid && this.transactionForm.valid;
  }

  onClearForm(): void {
    this.serverYearError = '';
    this.transactionForm.reset();
    this.filteredCosifs = [];
    this.toggleControl('cosifCode', false);
    this.saveEnabled = false;
  }

  onSaveTransaction(): void {
    if (this.transactionForm.invalid) return;

    const transaction: ManualTransaction = {
      ...this.transactionForm.getRawValue(),
      transactionDate: new Date(),
      userCode: 'TEST'
    };

    this.transactionService.saveManualTransaction(transaction).subscribe({
      next: () => {
        this.transactionForm.reset();
        this.toggleFormControls(false);
        this.toggleControl('cosifCode', false);
        this.serverYearError = '';
        this.saveEnabled = false;
        this.loadData();
      },
      error: (err) => {
        const errorObj = err.error?.errors?.find((e: any) => e.field === 'year');
        this.serverYearError = errorObj?.defaultMessage || 'An error occurred';
      }
    });
  }

  toggleFormControls(enable: boolean): void {
    const method = enable ? 'enable' : 'disable';
    ['month', 'year', 'productCode', 'amount', 'description', 'cosifCode']
      .forEach(field => this.transactionForm.get(field)?.[method]());
  }

  toggleControl(control: string, enable: boolean): void {
    const formControl = this.transactionForm.get(control);
    enable ? formControl?.enable() : formControl?.disable();
  }
}
