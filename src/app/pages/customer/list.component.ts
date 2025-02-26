import {Component, inject, OnInit, signal} from '@angular/core';
import {CustomerService} from '../../core/customer.service';
import {Customer, CustomerSummaryWithBalances} from '../../core/models';

@Component({
  selector: 'app-list',
  imports: [],
  template: `
    <h1>Customer</h1>
    <table>
      <thead>
      <tr>
        <th>Customer ID</th>
        <th>S Customer ID</th>
        <th>Name</th>
        <th>City</th>
        <th>Telephone</th>
        <th>Mobile</th>
        <th>Balance</th>
        <th>Vehicles</th>
      </tr>
      </thead>
      <tbody>
        @for(customer of customerBalances();track customer.customerId) {
          <tr>
            <td>{{customer.customerId}}</td>
            <td>{{customer.sCustomerId}}</td>
            <td>{{customer.name}}</td>
            <td>{{customer.city}}</td>
            <td>{{customer.telephone}}</td>
            <td>{{customer.mobile}}</td>
            <td>{{customer.balance}}</td>
            <td>{{customer.vehicles}}</td>
          </tr>
        }
      </tbody>
    </table>

  `,
  styles: ``
})
export class ListComponent implements OnInit{
    customerService = inject(CustomerService);
    customerBalances = signal<CustomerSummaryWithBalances[]>([]);

    ngOnInit(): void {
      this.customerService.getCustomerAccountSummary()
        .subscribe({
          next:(data: CustomerSummaryWithBalances[])=> {
            this.customerBalances.set(data);
          },error: (err) =>{
            console.log(err);
          }
        });
    }

}
