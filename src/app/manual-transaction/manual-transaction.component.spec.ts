import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManualTransactionComponent } from './manual-transaction.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxCurrencyModule } from 'ngx-currency';

describe('ManualTransactionComponent', () => {
  let component: ManualTransactionComponent;
  let fixture: ComponentFixture<ManualTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        BrowserAnimationsModule,
        NgxCurrencyModule,
      ],
      declarations: [ManualTransactionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManualTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.transactionForm.valid).toBeFalsy();
  });

  it('should validate required fields', () => {
    const monthControl = component.transactionForm.get('month');
    const yearControl = component.transactionForm.get('year');
    const productCodeControl = component.transactionForm.get('productCode');
    const cosifCodeControl = component.transactionForm.get('cosifCode');
    const amountControl = component.transactionForm.get('amount');
    const descriptionControl = component.transactionForm.get('description');

    monthControl?.setValue('');
    yearControl?.setValue('');
    productCodeControl?.setValue('');
    cosifCodeControl?.setValue('');
    amountControl?.setValue('');
    descriptionControl?.setValue('');

    expect(monthControl?.valid).toBeFalse();
    expect(yearControl?.valid).toBeFalse();
    expect(productCodeControl?.valid).toBeFalse();
    expect(cosifCodeControl?.valid).toBeFalse();
    expect(amountControl?.valid).toBeFalse();
    expect(descriptionControl?.valid).toBeFalse();
  });

  it('should enable Save button when form is valid and cosifCode is selected', () => {
    component.transactionForm.patchValue({
      month: 4,
      year: 2025,
      productCode: 'P001',
      amount: 100,
      description: 'Test Description',
    });

    const cosifControl = component.transactionForm.get('cosifCode');
    cosifControl?.reset('');
    cosifControl?.enable();

    cosifControl?.setValue('COSIF123456');

    expect(component.transactionForm.valid).toBeTrue();
    expect(component.saveEnabled).toBeTrue();
  });

  it('should reset form on clear', () => {
    component.transactionForm.patchValue({
      month: 4,
      year: 2025,
      productCode: 'P001',
      cosifCode: 'COSIF123456',
      amount: 100,
      description: 'Test Description',
    });
    component.onClearForm();
    expect(component.transactionForm.pristine).toBeTrue();
    expect(component.transactionForm.get('month')?.value).toBeNull();
  });
});
