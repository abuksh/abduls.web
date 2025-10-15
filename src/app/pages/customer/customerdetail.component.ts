import {Component,  inject, OnDestroy, OnInit,  signal} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {CustomerInvoiceService} from '../../core/customer-invoice.component';
import {Subscription, switchMap} from 'rxjs';
import {CustomerService} from '../../core/customer.service';
import {Customer, CustomerAging, CustomerInvoicesViewModel} from '../../core/models';
import { MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CustomerInvoiceListComponent} from './customer-invoice-list.component';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {CustomerInvoiceAgingViewComponent} from './customer-invoice-aging-view.component';

@Component({
  selector: 'app-customer-detail',
  imports: [
    MatTableModule,
    MatCheckboxModule,
    CustomerInvoiceListComponent,
    CurrencyPipe,
    CustomerInvoiceAgingViewComponent,
    NgIf,
    NgForOf,
  ],
  template: `
    <ng-container *ngIf="customer() as customer">
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
    </ng-container>

    <app-customer-invoice-aging-view [agingData]="agingData()"></app-customer-invoice-aging-view>

    <app-customer-invoice-list
      [invoices]="invoiceTransactions()"
      (selectedInvoices)="onSelectedInvoicesChange($event)">
    </app-customer-invoice-list>

    <div *ngIf="selectedInvoices.length > 0" class="selected-invoices">
      <ul>
        <li *ngFor="let invoice of selectedInvoices">
          {{ invoice.invoiceNumber }} - {{ invoice.customer.name }} - Balance: {{ invoice.balance | currency }}
        </li>
      </ul>
    </div>
  `,
  styles: `
  `
})
export class CustomerDetailComponent implements  OnInit, OnDestroy {
  router = inject(Router);
  route = inject(ActivatedRoute);

  subs$ = new Subscription();
  customerInvoiceService = inject(CustomerInvoiceService);
  customerService = inject(CustomerService);
  customer = signal<Customer | null>(null);
  selectedInvoices: CustomerInvoicesViewModel[] = [];
  agingData = signal<CustomerAging | null>(null);
  invoiceTransactions = signal<CustomerInvoicesViewModel[]>([]);

  onSelectedInvoicesChange(invoices: CustomerInvoicesViewModel[]) {
    this.selectedInvoices = invoices;
  }

  ngOnInit() {

    const customerId = this.getCustomerIdFromParams(this.route.snapshot.paramMap);
    const getCustomerDetails$ = this.customerService.getById(customerId);
    const getInvoiceTransactions$ = this.customerInvoiceService.getInvoiceTransactions(customerId, false);

    this.subs$.add(
      getCustomerDetails$
        .pipe(
          switchMap((customer) => {
            this.customer.set(customer);
            return getInvoiceTransactions$;
          })
        )
        .subscribe({
          next: (data) => {
            this.invoiceTransactions.set(data.invoiceTransactions);
            this.agingData.set(data.aging);
          },
          error: (err) => {
            console.error('Error fetching data: ', err);
            alert('An error occurred while fetching customer data');
          },
        })
    );
  }

  ngOnDestroy() {
    this.subs$.unsubscribe();
  }

  private getCustomerIdFromParams(params: ParamMap): number {
    return parseInt(params.get('id') ?? '0', 10);
  }

}
