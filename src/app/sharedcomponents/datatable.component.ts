import {AfterViewInit, Component, inject, OnInit, ViewChild, input, Input} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {TitleCasePipe} from '@angular/common';
import {LiveAnnouncer} from '@angular/cdk/a11y';

@Component({
  selector: 'app-datatable',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    TitleCasePipe,
  ],
  template: `
    <div class="table-container">
      <mat-form-field appearance="outline" class="filter-field">
        <mat-label>Filter</mat-label>
        <input
          matInput
          [(ngModel)]="filterText"
          (input)="applyFilter()"
          placeholder="Filter data"
        />
      </mat-form-field>

      <div class="table-wrapper">
        <!-- Angular Material Table -->
        <table
          mat-table
          [dataSource]="tableDataSource"
          matSort
          (matSortChange)="announceSortChange($event)"
          class="mat-elevation-z8 full-height"
        >
          <!-- Dynamically Generated Columns -->
          @for(column of displayedColumns();track column) {
            <ng-container matColumnDef="{{column}}">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>
                {{ column | titlecase }}
              </th>
              <td mat-cell *matCellDef="let element"> {{ element[column] }} </td>
            </ng-container>
          }


          <!-- Header Row -->
          <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
          <!-- Data Rows -->
          <tr mat-row *matRowDef="let row; columns: displayedColumns()"></tr>
        </table>
      </div>

      <mat-paginator
        [pageSize]="5"
        [pageSizeOptions]="[5, 10, 20]"
        showFirstLastButtons
      ></mat-paginator>
    </div>
  `,
  styles: `
    .table-container {
      display: flex;
      flex-direction: column;
      height: 100%; // Fills available vertical space
      width: 100%; // Fills available horizontal space
      overflow: hidden;

      .filter-field {
        width: 100%;
      }

      .table-wrapper {
        flex: 1; // Allows the table to grow and fill available space
        overflow: auto; // Make the table scrollable

        table {
          width: 100%;
          min-width: 600px; // Ensures a minimum width for responsiveness
        }

        th.mat-header-cell {
          background-color: #f5f5f5; // Sticky header background color
          position: sticky;
          top: 0;
          z-index: 2; // Ensure the header is above the body
        }
      }

      mat-paginator {
        flex-shrink: 0; // Ensure the paginator is always visible and doesn’t collapse
      }
    }
  `
})
export class DatatableComponent<T> implements OnInit, AfterViewInit {
  readonly dataSource = input<T[]>([]); // Input data as a generic array
   displayedColumns = input<string[]>([]);

// rated columns
  tableDataSource = new MatTableDataSource<T>();

  @ViewChild(MatSort) sort!: MatSort;
  filterText: string = '';

  ngOnInit(): void {
    const dataSource = this.dataSource();
    console.log(dataSource);
    if (dataSource && dataSource.length > 0) {
      this.tableDataSource.data = dataSource;
    }
    this.tableDataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.tableDataSource.sort = this.sort;
  }

  applyFilter(): void {
    this.tableDataSource.filter = this.filterText.trim().toLowerCase();
  }

  private _liveAnnouncer = inject(LiveAnnouncer);
  /** Announce the change in sort state for assistive technology. */
  async announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      await this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      await this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
