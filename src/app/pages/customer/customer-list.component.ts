import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {CustomerService} from '../../core/customer.service';
import { CustomerSummaryWithBalances} from '../../core/models';
import {CurrencyPipe} from '@angular/common';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-customer-list',
  imports: [CurrencyPipe],
  template: `
    <h1>Customer List</h1>
    <table>
      <thead>
      <tr>
        <th>Customer No.</th>
        <th>Name</th>
        <th>City</th>
        <th>Telephone</th>
        <th>Mobile</th>
        <th class="right">Balance</th>
        <th>Vehicles</th>
      </tr>
      </thead>
      <tbody>
        @for(customer of customerBalances();track customer.customerId) {
          <tr>
            <td>{{customer.sCustomerId}}</td>
            <td>{{customer.name}}</td>
            <td>{{customer.city}}</td>
            <td>{{customer.telephone}}</td>
            <td>{{customer.mobile}}</td>
            <td class="right"><strong>{{customer.balance | currency}}</strong></td>
            <td class="right">{{customer.vehicles}}</td>
          </tr>
        }
      </tbody>
    </table>

  `,
  styles: `
    .right {
      text-align: right;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background-color: #f1f1f1;
    }

    th {
      text-align: left;
      padding: 8px;
      font-weight: 600;
      color: #5f6368;
      border-bottom: 1px solid #ddd;
    }

    tr {
      border-bottom: 1px solid #ddd;
    }

    td {
      padding: 8px;
      color: #333;
    }

    tr:hover {
      background-color: #f5f5f5;
    }

    tbody tr {
      transition: background-color 0.3s ease;
    }

    th:first-child, td:first-child {
      padding-left: 16px;
    }

    th:last-child, td:last-child {
      padding-right: 16px;
    }

    th, td {
      text-align: left;
    }

  `
})
export class CustomerListComponent implements OnInit, OnDestroy{
    customerService = inject(CustomerService);
    subs$: Subscription  = new Subscription();
    customerBalances = signal<CustomerSummaryWithBalances[]>([]);

    ngOnInit(): void {
      this.subs$.add(
        this.customerService.getCustomerAccountSummary()
          .subscribe({
            next:(data: CustomerSummaryWithBalances[])=> {
              this.customerBalances.set(data);
            },error: (err) =>{
              console.log(err);
            }
          }));
    }

    ngOnDestroy() {
      this.subs$.unsubscribe();
    }

}
