import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { CustomerService } from '../../core/customer.service';
import { CustomerSummaryWithBalances } from '../../core/models';
import { Subscription } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import {Router} from '@angular/router';
import {KENDO_GRID} from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-customer-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CurrencyPipe,
    KENDO_GRID
  ],
  template: `
    <h1>Customer List</h1>
    <p>Click on the customer name link to view details. To see supplier customer line items click on the amount link.</p>

    <h3>Total Balance: {{ totalBalance() | currency }}</h3>

    <kendo-grid
      [kendoGridBinding]="accountSummary() || []"
      [sortable]="true"
      [filterable]="true"
      [height]="600"
      (cellClick)="viewDetails($event.dataItem)"
      class="kendo-grid-custom"
    >
      <kendo-grid-column field="sCustomerId" title="Customer No."></kendo-grid-column>
      <kendo-grid-column field="name" title="Name"></kendo-grid-column>
      <kendo-grid-column field="city" title="City"></kendo-grid-column>
      <kendo-grid-column field="telephone" title="Telephone"></kendo-grid-column>
      <kendo-grid-column field="mobile" title="Mobile"></kendo-grid-column>
      <kendo-grid-column field="vehicles" title="Vehicles"></kendo-grid-column>
      <kendo-grid-column field="balance" title="Balance" [width]="150">
        <ng-template kendoGridCellTemplate let-dataItem>
          <div class="right"><strong>{{ dataItem.balance | currency }}</strong></div>
        </ng-template>
      </kendo-grid-column>
    </kendo-grid>
 `,
  styles: `
  `
})
export class ListComponent implements OnInit, OnDestroy {
  customerService = inject(CustomerService);
  subs$: Subscription = new Subscription();

  // Columns are defined directly in the Kendo Grid template.
  accountSummary = signal<CustomerSummaryWithBalances[] | null>([])
  router = inject(Router);

  constructor() {}

  async viewDetails(customer: CustomerSummaryWithBalances) {
    await this.router.navigate(['/customer/detail/', customer.customerId]);
  }

  ngOnInit(): void {
    this.subs$.add(
      this.customerService.getCustomerAccountSummary().subscribe({
        next: (data: CustomerSummaryWithBalances[]) => {
          this.accountSummary.set(data);
        },
        error: (err) => {
          console.error(err);
          alert('An error occurred while fetching customer data');
        },
      })
    );
  }

  totalBalance =  computed(() => {
    return this.accountSummary()?.reduce(
      (sum, customer) => sum + (customer.balance ?? 0),
      0);
  });

  ngOnDestroy(): void {
    this.subs$.unsubscribe();
  }
}
