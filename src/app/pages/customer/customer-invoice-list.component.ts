import {AfterViewInit, Component, effect, input, OnInit, output, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CurrencyPipe, DatePipe} from '@angular/common';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {SelectionModel} from '@angular/cdk/collections';
import {CustomerInvoicesViewModel} from '../../core/models';

@Component({
  selector: 'app-customer-invoice-list',
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe,
    DatePipe
  ],
  template: `
    <div class="total-weight">
      Total Balance of Selected Invoices: {{getTotalBalance() | currency}}
    </div>

    <div class="table-container">
      <table mat-table [dataSource]="dataSource" matSort (matSortChange)="onSortChange($event)" class="mat-elevation-z8">
        <!-- Checkbox Column -->
        <ng-container matColumnDef="select">
          <th mat-header-cell *matHeaderCellDef>
            <mat-checkbox
              (change)="$event ? toggleAllRows() : null"
              [checked]="selection.hasValue() && isAllSelected()"
              [indeterminate]="selection.hasValue() && !isAllSelected()"
              [aria-label]="checkboxLabel()"
            >
            </mat-checkbox>
          </th>
          <td mat-cell *matCellDef="let row">
            <mat-checkbox
              (click)="$event.stopPropagation()"
              (change)="$event ? selection.toggle(row) : null"
              [checked]="selection.isSelected(row)"
              [aria-label]="checkboxLabel(row)"
            >
            </mat-checkbox>
          </td>
          <td mat-footer-cell *matFooterCellDef></td>
        </ng-container>

        <!-- Invoice Number Column -->
        <ng-container matColumnDef="invoiceNumber">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Invoice No.</th>
          <td mat-cell *matCellDef="let element" [class.sorted-column]="isSortedColumn('invoiceNumber')">{{element.invoiceNumber}}</td>
          <td mat-footer-cell *matFooterCellDef>Total</td>
        </ng-container>

        <!-- Customer Name Column -->
        <ng-container matColumnDef="customerName">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Customer</th>
          <td mat-cell *matCellDef="let element" [class.sorted-column]="isSortedColumn('customerName')">{{element.customer.name}}</td>
          <td mat-footer-cell *matFooterCellDef></td>
        </ng-container>

        <!-- Invoice Date Column -->
        <ng-container matColumnDef="invoiceDate">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Invoice Date</th>
          <td mat-cell *matCellDef="let element" [class.sorted-column]="isSortedColumn('invoiceDate')">{{element.invoiceDate | date:'dd MMM yy'}}</td>
          <td mat-footer-cell *matFooterCellDef></td>
        </ng-container>

        <!-- Allocation To Invoice Column -->
        <ng-container matColumnDef="allocateToInvoice">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Allocate to Invoice</th>
          <td mat-cell *matCellDef="let element" [class.sorted-column]="isSortedColumn('allocateToInvoice')">{{element.allocateToInvoice }}</td>
          <td mat-footer-cell *matFooterCellDef></td>
        </ng-container>



        <!-- Due Date Column -->
        <ng-container matColumnDef="dueDate">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Due Date</th>
          <td mat-cell *matCellDef="let element" [class.sorted-column]="isSortedColumn('dueDate')">{{element.dueDate | date:'dd MMM yy'}}</td>
          <td mat-footer-cell *matFooterCellDef></td>
        </ng-container>

        <!-- Type Column -->
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Type</th>
          <td mat-cell *matCellDef="let element" [class.sorted-column]="isSortedColumn('type')">{{element.type}}</td>
          <td mat-footer-cell *matFooterCellDef></td>
        </ng-container>

        <!-- Invoice Total Column -->
        <ng-container matColumnDef="invoiceTotal">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Total</th>
          <td mat-cell *matCellDef="let element" [class.sorted-column]="isSortedColumn('invoiceTotal')">{{element.invoiceTotal | currency}}</td>
          <td mat-footer-cell *matFooterCellDef>{{getTotalInvoiceTotal() | currency}}</td>
        </ng-container>

        <!-- Payments Column -->
        <ng-container matColumnDef="payments">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Payments</th>
          <td mat-cell *matCellDef="let element" [class.sorted-column]="isSortedColumn('payments')">{{element.payments | currency}}</td>
          <td mat-footer-cell *matFooterCellDef>{{getTotalPayments() | currency}}</td>
        </ng-container>

        <!-- credits Column -->
        <ng-container matColumnDef="credits">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Credits</th>
          <td mat-cell *matCellDef="let element" [class.sorted-column]="isSortedColumn('credits')">{{element.credits | currency}}</td>
          <td mat-footer-cell *matFooterCellDef></td>
        </ng-container>

        <!-- Balance Column -->
        <ng-container matColumnDef="balance">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Balance</th>
          <td mat-cell *matCellDef="let element" [class.sorted-column]="isSortedColumn('balance')">{{element.balance | currency}}</td>
          <td mat-footer-cell *matFooterCellDef>{{getTotalBalances() | currency}}</td>
        </ng-container>

        <!-- Overdue Column -->
        <ng-container matColumnDef="isOverDue">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Overdue</th>
          <td mat-cell *matCellDef="let element" [class.sorted-column]="isSortedColumn('isOverDue')">
            <span [class.overdue]="element.isOverDue">{{element.isOverDue ? 'Yes' : 'No'}}</span>
          </td>
          <td mat-footer-cell *matFooterCellDef></td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button color="primary" (click)="onViewDetails(element)" aria-label="View details">
              <mat-icon>visibility</mat-icon>
            </button>
          </td>
          <td mat-footer-cell *matFooterCellDef></td>
        </ng-container>

        <!-- Header and Row Definitions -->
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr
          mat-row
          *matRowDef="let row; columns: displayedColumns;"
          [class.selected]="selection.isSelected(row)"
        ></tr>
        <tr mat-footer-row *matFooterRowDef="displayedColumns; sticky: true"></tr>
      </table>
    </div>
  `,
  styles: `
    table {
      width: 100%;
    }

    .table-container {
      height: calc(100vh - 110px); /* Account for padding and total balance */
      overflow: auto;
    }

    .mat-mdc-table {
      min-width: 100%;
    }

    .mat-mdc-header-row {
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .mat-mdc-footer-row {
      position: sticky;
      bottom: 0;
      z-index: 100;
      height: 48px;
      background-color: #f1f3f4;
      font-weight: 500;
    }

    .mat-mdc-row {
      height: 40px;
      transition: box-shadow .08s linear,min-width .15s cubic-bezier(0.4,0.0,0.2,1);
    }

    .mat-mdc-row:hover {
      box-shadow: inset 1px 0 0 #dadce0, inset -1px 0 0 #dadce0, 0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15);
      z-index: 1;
    }

    .mat-mdc-cell, .mat-mdc-header-cell, .mat-mdc-footer-cell {
      padding: 0 16px;
      font-size: 14px;
      border-bottom: 1px solid #e0e0e0;
      color: #202124;
    }

    .mat-mdc-header-cell {
      color: #5f6368;
      font-weight: 500;
      font-size: 12px;
      letter-spacing: 0.3px;
    }


    .mat-column-select {
      width: 54px;
      padding: 0 0 0 16px;
    }

    .mat-column-invoiceNumber {
      font-weight: 500;
    }

    .mat-column-invoiceTotal,
    .mat-column-payments,
    .mat-column-balance {
      text-align: right;
    }

    .mat-column-actions {
      width: 48px;
      padding-right: 8px;
    }

    .mat-mdc-checkbox .mdc-checkbox:hover {
      background-color: rgba(32,33,36,.059);
    }

    .mat-mdc-checkbox .mdc-checkbox__background {
      border-color: #5f6368;
    }

    /* Sort header styling */
    .mat-sort-header-container {
      justify-content: inherit;
    }

    .mat-sort-header-arrow {
      color: #5f6368;
    }

    /* Button styling */
    .mat-mdc-icon-button {
      --mdc-icon-button-state-layer-size: 36px;
      padding: 6px;
      width: 36px;
      height: 36px;
    }

    .overdue {
      color: #d93025;
      font-weight: 500;
    }


    .selected {
      background-color: #f2f6fc;
    }

    /* Sorted column highlighting */
    .sorted-column {
      background-color: rgba(232, 240, 254, 0.5);
    }
  `
})
export class CustomerInvoiceListComponent implements OnInit, AfterViewInit {
  invoices = input<CustomerInvoicesViewModel[]>([]);
  selectedInvoices = output<CustomerInvoicesViewModel[]>();

  displayedColumns: string[] = [
    'select',
    'invoiceNumber',
    'invoiceDate',
    'allocateToInvoice',
    'dueDate',
    'type',
    'invoiceTotal',
    'payments',
    'credits',
    'balance',
    'isOverDue',
    'actions'
  ];
  dataSource = new MatTableDataSource<CustomerInvoicesViewModel>([]);
  selection = new SelectionModel<CustomerInvoicesViewModel>(true, []);
  currentSortColumn: string | null = null;

  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    // Update selected invoices signal whenever selection changes
    this.selection.changed.subscribe(() => {
      this.selectedInvoices.emit(this.selection.selected);
    });

    // React to changes in the invoices input signal
    effect(() => {
      this.dataSource.data = this.invoices();
      this.setupSorting();
    });
  }

  ngOnInit() {
    this.dataSource.data = this.invoices();
  }

  ngAfterViewInit() {
    this.setupSorting();
  }

  private setupSorting() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'customerName':
            return item.customer.name;
          default:
            return (item as any)[property];
        }
      };
    }
  }

  onSortChange(sort: Sort) {
    this.currentSortColumn = sort.direction ? sort.active : null;
  }

  isSortedColumn(columnName: string): boolean {
    return this.currentSortColumn === columnName;
  }

  getTotalBalance(): number {
    return this.selection.selected
      .map(row => row.balance)
      .reduce((sum, balance) => sum + balance, 0);
  }

  getTotalInvoiceTotal(): number {
    return this.dataSource.data
      .map(row => row.invoiceTotal)
      .reduce((sum, total) => sum + total, 0);
  }

  getTotalPayments(): number {
    return this.dataSource.data
      .map(row => row.payments)
      .reduce((sum, payments) => sum + payments, 0);
  }

  getTotalBalances(): number {
    return this.dataSource.data
      .map(row => row.balance)
      .reduce((sum, balance) => sum + balance, 0);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: CustomerInvoicesViewModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  onViewDetails(invoice: CustomerInvoicesViewModel) {
    console.log('View details for invoice:', invoice);
  }
}
