import {ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {CustomerInvoiceService} from '../../core/customer-invoice.component';
import {Subscription, switchMap} from 'rxjs';
import {CustomerService} from '../../core/customer.service';
import {Customer, CustomerInvoicesViewModel} from '../../core/models';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-customer-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    CurrencyPipe,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    CurrencyPipe
  ],
  template: `
    <h1>Customer Detail</h1>
    @if (customer()) {
      <div class="customer-details">
        <div><strong>Name:</strong> {{ this.customer()?.name }}</div>
        <div><strong>Address:</strong> {{ this.customer()?.street }} {{ this.customer()?.city }} {{ this.customer()?.postCode }}</div>
        <div><strong>Contact:</strong> {{ this.customer()?.email }} | {{ this.customer()?.telephone }}</div>
      </div>
    }
    <h1>{{getTotalBalance() | currency}}</h1>
    <table mat-table [dataSource]="dataSource.data"
           matSort
           class="mat-elevation-z8"
           (mousedown)="onMouseDown($event)"
           (mousemove)="onMouseMove($event)"
           (mouseup)="onMouseUp()"
           (contextmenu)="$event.preventDefault()">

      <!-- Checkbox Column -->
      <ng-container matColumnDef="select">
        <th mat-header-cell *matHeaderCellDef>
          <mat-checkbox
            (change)="toggleAllRows()"
            [checked]="selection.hasValue() && isAllSelected()"
            [indeterminate]="selection.hasValue() && !isAllSelected()"
          >
          </mat-checkbox>
        </th>
        <td mat-cell *matCellDef="let row">
          <mat-checkbox
            (click)="$event.stopPropagation()"
            (change)="toggleCheckbox(row)"
            [checked]="selection.isSelected(row)"
          >
          </mat-checkbox>
        </td>
      </ng-container>

      <!-- Invoice Date Column -->
      <ng-container matColumnDef="invoiceDate">

        <th mat-header-cell *matHeaderCellDef mat-sort-header> Invoice Date </th>
        <td mat-cell *matCellDef="let item"> {{ item.invoiceDate | date: 'dd MMM yyyy' }} </td>
      </ng-container>

      <!-- Invoice ID Column -->
      <ng-container matColumnDef="sInvoiceId">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Invoice ID </th>
        <td mat-cell *matCellDef="let item"> {{ item.sInvoiceId }} </td>
      </ng-container>

      <!-- Job Card Number Column -->
      <ng-container matColumnDef="jobCardNumber">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Job Card Number </th>
        <td mat-cell *matCellDef="let item"> {{ item.jobCardNumber }} </td>
      </ng-container>

      <!-- Purchase Order Column -->
      <ng-container matColumnDef="purchaseOrder">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Purchase Order </th>
        <td mat-cell *matCellDef="let item"> {{ item.purchaseOrder }} </td>
      </ng-container>

      <!-- Due Date Column -->
      <ng-container matColumnDef="dueDate">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Due Date </th>
        <td mat-cell *matCellDef="let item"> {{ item.dueDate | date: 'dd MMM yyyy' }} </td>
      </ng-container>

      <!-- Invoice Total Column -->
      <ng-container matColumnDef="invoiceTotal">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Invoice Total </th>
        <td mat-cell *matCellDef="let item"> {{ item.invoiceTotal | currency }} </td>
      </ng-container>

      <!-- Payments Column -->
      <ng-container matColumnDef="payments">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Payments </th>
        <td mat-cell *matCellDef="let item"> {{ item.payments | currency }} </td>
      </ng-container>

      <!-- Credits Column -->
      <ng-container matColumnDef="credits">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Credits </th>
        <td mat-cell *matCellDef="let item"> {{ item.credits | currency }} </td>
      </ng-container>

      <!-- Balance Column -->
      <ng-container matColumnDef="balance">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Balance </th>
        <td mat-cell *matCellDef="let item"> {{ item.balance | currency }} </td>
      </ng-container>

      <!-- Header and Row Declarations -->
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns; let i = index"
          [class.selected]="selection.isSelected(row)"
          [attr.data-index]="i"
          (click)="onRowClick($event, row)"
      ></tr>

    </table>
  `,
  styles: `
    table {
      width: 100%;
      user-select: none; /* Prevents text selection */
      -webkit-user-select: none; /* Safari */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* IE10+/Edge */
    }

    .selected {
      background-color: rgba(0, 0, 255, 0.2); /* Light blue highlight */
    }

    .drag-selecting {
      background-color: rgba(
          0,
          255,
          0,
          0.3
      ); /* Light green highlight during drag */
    }

    .total-weight {
      margin-bottom: 16px;
      padding: 12px;
      background-color: #f5f5f5;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
    }
  `
})
export class CustomerDetailComponent implements  OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);

  subs$ = new Subscription();
  customerInvoiceService = inject(CustomerInvoiceService);
  customerService = inject(CustomerService);
  customer = signal<Customer | null>(null);

  invoiceTransactions = signal<CustomerInvoicesViewModel[]>([]);
  displayedColumns: string[] = [
    'select',
    'invoiceDate',
    'sInvoiceId',
    'jobCardNumber',
    'purchaseOrder',
    'dueDate',
    'invoiceTotal',
    'payments',
    'credits',
    'balance',
  ];
  dataSource: MatTableDataSource<CustomerInvoicesViewModel> =
    new MatTableDataSource<CustomerInvoicesViewModel>([]);
  @ViewChild(MatSort, {static: true})
  sort!: MatSort;

  selection = new SelectionModel<CustomerInvoicesViewModel>(true, []);

  isDragging = false;
  startRowIndex: number | null = null;
  endRowIndex: number | null = null;


  ngOnInit() {
    const customerId = this.getCustomerIdFromParams(this.route.snapshot.paramMap);
    const getCustomerDetails$ = this.customerService.getById(customerId);
    const getInvoiceTransactions$ =
      this.customerInvoiceService.getInvoiceTransactions(customerId, false);

    this.subs$.add(
      getCustomerDetails$
        .pipe(
          switchMap((customerDetails:Customer) => {
            this.customer.set(customerDetails);
            return getInvoiceTransactions$;
          })
        )
        .subscribe({
          next: (data:CustomerInvoicesViewModel[]) => {
            this.dataSource.data = data;
            this.dataSource.sort = this.sort;
          },
          error: (err) => {
            console.error('Error fetching data: ', err);
          },
        })
    );
  }

  private getCustomerIdFromParams(params: ParamMap): number {
    return parseInt(params.get('id') ?? '0', 10);
  }

  getTotalBalance(): number {
    return this.selection.selected
      .map(row => row.balance)
      .reduce((sum, weight) => sum + weight, 0);
  }

  onRowClick(event: MouseEvent, row: CustomerInvoicesViewModel) {
    if (event.metaKey || event.ctrlKey) {
      this.selection.toggle(row);
    } else {
      if (!this.isDragging) {
        this.selection.toggle(row);
      }
    }
  }

  toggleCheckbox(row: CustomerInvoicesViewModel) {
    this.selection.toggle(row);
  }

  onMouseDown(event: MouseEvent) {
    if (event.button !== 0) return; // Only respond to left-click
    this.isDragging = true;
    this.startRowIndex = this.getRowIndex(event);
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.endRowIndex = this.getRowIndex(event);
      this.updateDragSelection();
    }
  }

  onMouseUp() {
    this.isDragging = false;
    this.startRowIndex = null;
    this.endRowIndex = null;
  }

  getRowIndex(event: MouseEvent): number | null {
    const target = event.target as HTMLElement;
    const rowElement = target.closest('tr');
    return rowElement ? parseInt(rowElement.getAttribute('data-index')!, 10) : null;
  }

  updateDragSelection() {
    if (this.startRowIndex === null || this.endRowIndex === null) return;

    const [start, end] = [this.startRowIndex, this.endRowIndex].sort((a, b) => a - b);
    const selectedRows = this.dataSource.data.slice(start, end + 1);

    // Instead of clearing, we'll select the new rows while keeping existing selections
    selectedRows.forEach(row => {
      if (!this.selection.isSelected(row)) {
        this.selection.select(row);
      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.data);
    }
  }
}
