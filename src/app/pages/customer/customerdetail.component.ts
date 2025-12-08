import {Component,  inject, OnDestroy, OnInit,  signal} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {CustomerInvoiceService} from '../../core/customer-invoice.component';
import {Subscription, switchMap} from 'rxjs';
import {CustomerService} from '../../core/customer.service';
import {Customer, CustomerAging, CustomerInvoicesViewModel} from '../../core/models';
import { MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CustomerInvoiceListComponent} from './customer-invoice-list.component';
import { CurrencyPipe } from '@angular/common';
import {CustomerInvoiceAgingViewComponent} from './customer-invoice-aging-view.component';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    CustomerInvoiceListComponent,
    CurrencyPipe,
    CustomerInvoiceAgingViewComponent,
    MatButton
  ],
  template: `
    @if (customer(); as customer) {
      <h1>{{ customer.name }}</h1>
      <address class="customer-details">
        <div>
          <strong>Address:</strong> {{ customer.street }} {{ customer.city }} {{ customer.postCode }}
        </div>
        <div>
          <strong>Contact:</strong>
          {{ customer.email }}
          {{ customer.telephone || customer.mobile }}
        </div>
      </address>
    }

    <app-customer-invoice-aging-view [agingData]="agingData()"></app-customer-invoice-aging-view>

    <h2>Invoices</h2>
    <p>Select invoices to view details.</p>

    <button mat-button mat-flat-button (click)="showInvoices(true)">Paid</button>
    <button mat-button mat-flat-button (click)="showInvoices(false)">Unpaid</button>

    <app-customer-invoice-list
      [invoices]="invoiceTransactions()"
      (selectedInvoices)="onSelectedInvoicesChange($event)">
    </app-customer-invoice-list>

    @if (selectedInvoices.length > 0) {
      <div class="selected-invoices">
        <ul>
          @for (invoice of selectedInvoices; track invoice) {
            <li>
              {{ invoice.invoiceNumber }} - {{ invoice.customer.name }} - Balance: {{ invoice.balance | currency }}
            </li>
          }
        </ul>
      </div>
    }
    `,
  styles: `
  `
})
export class CustomerDetailComponent implements  OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  subs$ = new Subscription();
  customerInvoiceService = inject(CustomerInvoiceService);
  customerService = inject(CustomerService);
  customer = signal<Customer | null>(null);
  selectedInvoices: CustomerInvoicesViewModel[] = [];
  agingData = signal<CustomerAging | null>(null);
  invoiceTransactions = signal<CustomerInvoicesViewModel[]>([]);
  customerId = signal(0);

  onSelectedInvoicesChange(invoices: CustomerInvoicesViewModel[]) {
    this.selectedInvoices = invoices;
  }

  ngOnInit() {
    this.customerId.set(this.getCustomerIdFromParams(this.route.snapshot.paramMap));
    this.getCustomer();
    this.showInvoices(true);
  }

  getCustomer(){
    const getCustomerDetails$ = this.customerService.getById(this.customerId());
    this.subs$.add(
      getCustomerDetails$
        .subscribe({
          next: (customer) => {
            this.customer.set(customer);
          },
          error: (err) => {
            console.error('Error fetching data: ', err);
            alert('An error occurred while fetching customer data');
          },
        })
    );
  }

  showInvoices(paid: boolean = true) {
    const invoices$ = this.customerInvoiceService.
      getInvoiceTransactions(this.customerId(),
      paid);
    this.subs$.add(
      invoices$.subscribe({
        next: (data) => {
          this.invoiceTransactions.set(data.invoiceTransactions);
        },
        error: (err) => {
          console.error('Error fetching data: ', err);
          alert('An error occurred while fetching customer transactions data');
        },
      })
    )
  }

  ngOnDestroy() {
    this.subs$.unsubscribe();
  }

  private getCustomerIdFromParams(params: ParamMap): number {
    return parseInt(params.get('id') ?? '0', 10);
  }

}
