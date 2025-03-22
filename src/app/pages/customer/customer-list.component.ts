import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import { CustomerService } from '../../core/customer.service';
import { CustomerSummaryWithBalances } from '../../core/models';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-customer-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatSortModule,
    CurrencyPipe
  ],
  template: `
    <h1>Customer List</h1>

    <h3>Total Balance: {{totalBalance() | currency}}</h3>

    <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z8">
      <!-- Customer No -->
      <ng-container matColumnDef="sCustomerId">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Customer No.</th>
        <td mat-cell *matCellDef="let customer">{{ customer.sCustomerId }}</td>
      </ng-container>

      <!-- Name -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
        <td mat-cell *matCellDef="let customer">{{ customer.name }}</td>
      </ng-container>

      <!-- City -->
      <ng-container matColumnDef="city">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>City</th>
        <td mat-cell *matCellDef="let customer">{{ customer.city }}</td>
      </ng-container>

      <!-- Telephone -->
      <ng-container matColumnDef="telephone">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Telephone</th>
        <td mat-cell *matCellDef="let customer">{{ customer.telephone }}</td>
      </ng-container>

      <!-- Mobile -->
      <ng-container matColumnDef="mobile">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Mobile</th>
        <td mat-cell *matCellDef="let customer">{{ customer.mobile }}</td>
      </ng-container>

      <!-- Balance -->
      <ng-container matColumnDef="balance">
        <th mat-header-cell *matHeaderCellDef mat-sort-header class="right">Balance</th>
        <td mat-cell *matCellDef="let customer" class="right">
          <strong>{{ customer.balance | currency }}</strong>
        </td>
      </ng-container>

      <!-- Vehicles -->
      <ng-container matColumnDef="vehicles">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Vehicles</th>
        <td mat-cell *matCellDef="let customer">{{ customer.vehicles }}</td>
      </ng-container>

      <!-- Table Header -->
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>

      <!-- Table Rows -->
      <tr mat-row *matRowDef="let row; columns: displayedColumns;" (click)="viewDetails(row)"></tr>
    </table>
 `,
  styles: `
  `
})
export class CustomerListComponent implements OnInit, OnDestroy {
  customerService = inject(CustomerService);
  subs$: Subscription = new Subscription();

  displayedColumns: string[] = [
    'sCustomerId',
    'name',
    'city',
    'telephone',
    'mobile',
    'balance',
    'vehicles',
  ];
  dataSource = new MatTableDataSource<CustomerSummaryWithBalances>([]);
  accountSummary =
    signal<CustomerSummaryWithBalances[] | null>([])
  router = inject(Router);
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    effect(() => {
      this.dataSource.sort = this.sort;
    });
  }

  async viewDetails(customer: CustomerSummaryWithBalances) {
    await this.router.navigate(['/customer-detail', customer.customerId]);
  }

  ngOnInit(): void {
    this.subs$.add(
      this.customerService.getCustomerAccountSummary().subscribe({
        next: (data: CustomerSummaryWithBalances[]) => {
          this.accountSummary.set(data);
          this.dataSource.data = data;
          this.dataSource.sort = this.sort;
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
