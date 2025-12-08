import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {CustomerAging} from '../../core/models';
import {CurrencyPipe} from '@angular/common';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-customer-invoice-aging-view',
  standalone: true,
  imports: [MatCardModule, CurrencyPipe],
  template: `
    @if(agingData()) {
    <mat-card class="aging-card">
      <mat-card-content>
        <div class="aging-container">
          <div class="aging-item">
            <div class="aging-header" style="color: #4CAF50;">Current</div>
            <div class="aging-amount">{{agingData()!.current | currency}}</div>
          </div>
          <div class="aging-item">
            <div class="aging-header" style="color: #FF9800;">1-30 Days</div>
            <div class="aging-amount">{{agingData()!._30_days | currency}}</div>
          </div>
          <div class="aging-item">
            <div class="aging-header" style="color: #2196F3;">31-60 Days</div>
            <div class="aging-amount">{{agingData()!._60_days | currency}}</div>
          </div>
          <div class="aging-item">
            <div class="aging-header" style="color: #F44336;">61+ Days</div>
            <div class="aging-amount">{{agingData()!._60Plus_days | currency}}</div>
          </div>
          <div class="aging-item total">
            <div class="aging-header">Balance</div>
            <div class="aging-amount">{{agingData()!.balance | currency}}</div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
    }
  `,
  styles: [`
  .aging-card {
    margin-bottom: 20px;
  }
  .aging-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 8px;
  }
  .aging-item {
    flex: 1;
    text-align: center;
    padding: 8px;
    border-right: 1px solid #e0e0e0;
  }
  .aging-item:last-child {
    border-right: none;
  }
  .aging-header {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
  }
  .aging-amount {
    font-size: 18px;
    font-weight: bold;
  }
  .total {
    background-color: #f5f5f5;
    border-radius: 4px;
  }
  @media (max-width: 768px) {
    .aging-container {
      flex-direction: column;
      gap: 8px;
    }
    .aging-item {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid #e0e0e0;
    }
    .aging-item:last-child {
      border-bottom: none;
    }
  }
`]
})
export class CustomerInvoiceAgingViewComponent {
  agingData = input.required<CustomerAging | null>();
}
