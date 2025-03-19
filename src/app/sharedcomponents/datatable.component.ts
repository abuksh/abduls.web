import {Component, OnInit, Input} from '@angular/core';

import {Column} from '../core/models';
import {CommonModule, NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';



@Component({
  selector: 'app-datatable',
  imports: [
    CommonModule,
    NgForOf,
    FormsModule,
    NgIf,
    NgClass
  ],
  template: `
    <div class="search-container">
      <input type="text" placeholder="Search..." [(ngModel)]="searchTerm">
    </div>

    <table>
      <thead>
      <tr>
        <th class="checkbox-cell">
          <input type="checkbox" (change)="toggleSelectAll($event)" [checked]="isAllSelected()">
        </th>
        <th *ngFor="let column of columns" (click)="sortData(column.key)">
          {{ column.label }}
          <span *ngIf="sortedColumn === column.key">
          {{ sortDirection ? '▲' : '▼' }}
        </span>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let row of sortedFilteredData(); let i = index"
          [ngClass]="{'selected': isRowSelected(row.id)}"
          (click)="toggleRowSelection(row.id, $event)">
        <td class="checkbox-cell">
          <input type="checkbox" (click)="toggleRowSelection(row.id, $event)" [checked]="isRowSelected(row.id)">
        </td>
        <td *ngFor="let column of columns">
          <span *ngIf="column.type === 'button'">
            <button (click)="column.action?.(row)">
              {{ column.label }}
            </button>
          </span>
          <span *ngIf="column.type !== 'button'">
            {{ row[column.key] }}
          </span>
        </td>
      </tr>
      </tbody>
    </table>


  `,
  styles: `


  `
})
export class DatatableComponent implements OnInit {
  @Input() columns: Column[] = [];
  @Input() dataSource: any[] = [];

  sortedColumn: string = '';
  sortDirection: boolean = true;
  searchTerm: string = '';
  selectedRowIds: Set<number> = new Set();
  lastSelectedRowId: number | null = null;

  constructor() {}

  ngOnInit(): void {}

  sortData(columnKey: string) {
    if (this.sortedColumn === columnKey) {
      this.sortDirection = !this.sortDirection;
    } else {
      this.sortedColumn = columnKey;
      this.sortDirection = true;
    }
  }

  sortedFilteredData() {
    let filtered = this.dataSource.filter(row =>
      Object.values(row).some(val =>
        String(val).toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );

    if (!this.sortedColumn) return filtered;

    return [...filtered].sort((a, b) => {
      const valueA = a[this.sortedColumn] || '';
      const valueB = b[this.sortedColumn] || '';

      return this.sortDirection
        ? valueA > valueB ? 1 : -1
        : valueA < valueB ? 1 : -1;
    });
  }

  isRowSelected(rowId: number) {
    return this.selectedRowIds.has(rowId);
  }

  toggleRowSelection(rowId: number, event: MouseEvent) {
    event.stopPropagation();

    if (event.shiftKey && this.lastSelectedRowId !== null) {
      this.selectRange(this.lastSelectedRowId, rowId);
    } else if (event.ctrlKey || event.metaKey) {
      this.toggleSingleRow(rowId);
    } else {
      this.selectedRowIds.clear();
      this.selectedRowIds.add(rowId);
    }
    this.lastSelectedRowId = rowId;
  }

  toggleSingleRow(rowId: number) {
    if (this.selectedRowIds.has(rowId)) {
      this.selectedRowIds.delete(rowId);
    } else {
      this.selectedRowIds.add(rowId);
    }
  }

  selectRange(startId: number, endId: number) {
    const rows = this.sortedFilteredData();
    const startIndex = rows.findIndex(row => row.id === startId);
    const endIndex = rows.findIndex(row => row.id === endId);
    if (startIndex === -1 || endIndex === -1) return;

    const [min, max] = [startIndex, endIndex].sort((a, b) => a - b);
    for (let i = min; i <= max; i++) {
      this.selectedRowIds.add(rows[i].id);
    }
  }

  isAllSelected() {
    return this.selectedRowIds.size === this.dataSource.length;
  }

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.selectedRowIds = new Set(this.dataSource.map(row => row.id));
    } else {
      this.selectedRowIds.clear();
    }
  }
}
