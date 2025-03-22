import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CustomerAging, CustomerInvoicesViewModel} from './models';

// Models for request and response
export interface StatementParam {
  customerId: number;
  statementDate: string; // Assuming ISO date format
}

export interface Invoice {
  invoiceId?: number;
  customer: any; // Define the type based on your Customer model
  items: any[]; // Define the array type for line items of the invoice
  // Add other Invoice properties...
}


@Injectable({
  providedIn: 'root',
})
export class CustomerInvoiceService {
  private baseUrl = 'http://localhost:5268/api/CustomerInvoice'; // Adjust base URL as needed
  constructor(private http: HttpClient) {}

  /**
   * Fetch a statement for a specific customer by date.
   * @param params Statement parameters with customer ID and statement date.
   * @returns Observable of the statement response.
   */
  getStatement(params: StatementParam): Observable<any> {
    const url = `${this.baseUrl}/GetStatement`;
    return this.http.post<any>(url, params);
  }

  /**
   * Create a new invoice.
   * @param invoice The invoice to create.
   * @returns Observable of the created invoice.
   */
  createInvoice(invoice: Invoice): Observable<any> {
    const url = this.baseUrl;
    return this.http.post<any>(url, invoice);
  }

  /**
   * Update an existing invoice.
   * @param invoice The invoice with updated details.
   * @returns Observable of the updated invoice.
   */
  updateInvoice(invoice: Invoice): Observable<any> {
    const url = this.baseUrl;
    return this.http.put<any>(url, invoice);
  }

  /**
   * Create a credit note associated with an invoice.
   * @param creditNote The credit note to create.
   * @returns Observable of the operation status.
   */
  createCreditNote(creditNote: Invoice): Observable<void> {
    const url = `${this.baseUrl}/CreateCreditNote`;
    return this.http.post<void>(url, creditNote);
  }

  /**
   * Delete an invoice by its ID.
   * @param invoiceId The ID of the invoice to delete.
   * @returns Observable of the operation status.
   */
  deleteInvoice(invoiceId: number): Observable<void> {
    const url = `${this.baseUrl}/Delete/${invoiceId}`;
    return this.http.delete<void>(url);
  }

  /**
   * Fetch all invoice transactions for a customer.
   * @param customerId The ID of the customer.
   * @param paid Specify true to fetch only paid invoices, or false for unpaid ones. (Optional)
   * @returns Observable of the invoice transactions.
   */
  getInvoiceTransactions(
    customerId: number,
    paid: boolean = false
  ): Observable<any> {
    const url = `${this.baseUrl}/GetInvoiceTransactions/${customerId}/${paid}`;
    return this.http.get<CustomerInvoicesViewModel[]>(url);
  }
}
