import {Component,  inject, OnDestroy, OnInit,  signal} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {CustomerInvoiceService} from '../../core/customer-invoice.component';
import {Subscription, switchMap} from 'rxjs';
import {CustomerService} from '../../core/customer.service';
import {Customer, CustomerAging, CustomerInvoicesViewModel} from '../../core/models';
import { MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CustomerInvoiceListComponent} from './customer-invoice-list.component';
import {CurrencyPipe} from '@angular/common';
import {CustomerInvoiceAgingViewComponent} from './customer-invoice-aging-view.component';

@Component({
  selector: 'app-customer-detail',
  imports: [
    MatTableModule,
    MatCheckboxModule,
    CustomerInvoiceListComponent,
    CurrencyPipe,
    CustomerInvoiceAgingViewComponent,
  ],
  template: `
    @if (customer()) {
      <h1>{{ this.customer()?.name }}</h1>
      <address class="customer-details">
        <div>
          <strong>Address:</strong> {{ this.customer()?.street }} {{ this.customer()?.city }} {{ this.customer()?.postCode }}
        </div>
        <div><strong>Contact:</strong>
          {{ this.customer()?.email }}
           {{ this.customer()?.telephone || this.customer()?.mobile }}
        </div>
      </address>
    }

    <app-customer-invoice-aging-view [agingData]="agingData()"></app-customer-invoice-aging-view>
   <app-customer-invoice-list [invoices]="invoiceTransactions()" (selectedInvoices)="onSelectedInvoicesChange($event)"></app-customer-invoice-list>

    @if (selectedInvoices.length > 0) {
      <div class="selected-invoices">
        <ul>
          @for(invoice of selectedInvoices; track invoice.invoiceId) {
            <li>
              {{invoice.invoiceNumber}} - {{invoice.customer.name}} - Balance: {{invoice.balance | currency}}
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
