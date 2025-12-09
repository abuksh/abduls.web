import {AfterViewInit, Component, input, OnInit, output} from '@angular/core';
import {CurrencyPipe, DatePipe} from '@angular/common';
import { GridModule } from '@progress/kendo-angular-grid';
import {CustomerInvoicesViewModel} from '../../core/models';

@Component({
  selector: 'app-customer-invoice-list',
  standalone: true,
  imports: [
    GridModule,
    CurrencyPipe,
    DatePipe
  ],
  template: `
    <div class="total-weight">
      Total Balance of Selected Invoices: {{getTotalBalance() | currency}}
    </div>
    <kendo-grid
      [kendoGridBinding]="invoices()"
      [sortable]="true"
      [filterable]="true"
      [resizable]="false"
      [height]="650"
      [selectable]="{ enabled: true, mode: 'multiple', checkboxOnly: true }"
      [selectedKeys]="selectedKeys"
      [kendoGridSelectBy]="'invoiceId'"
      (selectedKeysChange)="onSelectedKeysChange($event)"
    >
      <kendo-grid-checkbox-column [width]="50" [showSelectAll]="true"></kendo-grid-checkbox-column>
      <kendo-grid-column field="invoiceNumber" title="Invoice No."></kendo-grid-column>

      <kendo-grid-column field="invoiceDate" title="Invoice Date" filter="date" >
        <ng-template kendoGridCellTemplate let-dataItem>
          {{ dataItem.invoiceDate | date:'dd MMM yy' }}
        </ng-template>
      </kendo-grid-column>

      <kendo-grid-column field="jobCardNumber" title="Job Card"></kendo-grid-column>

      <kendo-grid-column field="dueDate" title="Due Date" filter="date">
        <ng-template kendoGridCellTemplate let-dataItem>
          {{ dataItem.dueDate | date:'dd MMM yy' }}
        </ng-template>
      </kendo-grid-column>

      <kendo-grid-column field="purchaseOrder" title="Purchase Order"></kendo-grid-column>

      <kendo-grid-column field="invoiceTotal" title="Total" filter="numeric" >
        <ng-template kendoGridCellTemplate let-dataItem>
          {{ dataItem.invoiceTotal | currency }}
        </ng-template>
        <ng-template kendoGridFooterTemplate>
          {{ getTotalInvoiceTotal() | currency }}
        </ng-template>
      </kendo-grid-column>

      <kendo-grid-column field="payments" title="Payments" filter="numeric">
        <ng-template kendoGridCellTemplate let-dataItem>
          {{ dataItem.payments | currency }}
        </ng-template>
        <ng-template kendoGridFooterTemplate>
          {{ getTotalPayments() | currency }}
        </ng-template>
      </kendo-grid-column>

      <kendo-grid-column field="credits" title="Credits" filter="numeric">
        <ng-template kendoGridCellTemplate let-dataItem>
          {{ dataItem.credits | currency }}
        </ng-template>
      </kendo-grid-column>

      <kendo-grid-column field="balance" title="Balance" filter="numeric">
        <ng-template kendoGridCellTemplate let-dataItem>
          @if(dataItem.balance > 0 && !dataItem.isPaid && dataItem.isOverDue) {
            <span class="overdue">{{ dataItem.balance | currency }}</span>
          } @else {
            {{ dataItem.balance | currency }}
          }
        </ng-template>
        <ng-template kendoGridFooterTemplate>
          {{ getTotalBalances() | currency }}
        </ng-template>
      </kendo-grid-column>



      <kendo-grid-column title="Actions" [width]="90">
        <ng-template kendoGridCellTemplate let-dataItem>
          <button class="view-btn" (click)="onViewDetails(dataItem)">View</button>
        </ng-template>
      </kendo-grid-column>

    </kendo-grid>
  `,
  styles: `


    .k-grid {
      flex: 1 1 auto;
    }

    .overdue {
      color: #d93025;
      font-weight: 500;
    }

    .view-btn {
      padding: 4px 8px;
      font-size: 12px;
      cursor: pointer;
    }
  `
})
export class InvoiceListComponent implements OnInit, AfterViewInit {
  invoices = input<CustomerInvoicesViewModel[]>([]);
  selectedInvoices = output<CustomerInvoicesViewModel[]>();

  // Kendo Grid selection keys and cache of selected rows
  selectedKeys: Array<number> = [];
  private selectedRows: CustomerInvoicesViewModel[] = [];


  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {}

  onSelectedKeysChange(keys: number[]) {
    this.selectedKeys = keys;
    // map keys back to data items for emitting
    const data = this.invoices() || [];
    this.selectedRows = data.filter(d => this.selectedKeys.includes(d.invoiceId));
    this.selectedInvoices.emit(this.selectedRows);
  }

  getTotalBalance(): number {
    return (this.selectedRows || [])
      .map(row => row.balance)
      .reduce((sum, balance) => sum + balance, 0);
  }

  getTotalInvoiceTotal(): number {
    return (this.invoices() || [])
      .map(row => row.invoiceTotal)
      .reduce((sum, total) => sum + total, 0);
  }

  getTotalPayments(): number {
    return (this.invoices() || [])
      .map(row => row.payments)
      .reduce((sum, payments) => sum + payments, 0);
  }

  getTotalBalances(): number {
    return (this.invoices() || [])
      .map(row => row.balance)
      .reduce((sum, balance) => sum + balance, 0);
  }

  onViewDetails(invoice: CustomerInvoicesViewModel) {
    console.log('View details for invoice:', invoice);
  }
}
