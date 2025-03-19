import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Customer, CustomerContactPerson, CustomerSummaryWithBalances} from './models';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  http: HttpClient = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5268/api/Customer';

  getAll(): Observable<Customer[]>{
    return this.http.get<Customer[]>(`${this.baseUrl}/GetAll`);
  }

  getCustomerAccountSummary(): Observable<CustomerSummaryWithBalances[]>{
    return this.http.get<CustomerSummaryWithBalances[]>(`${this.baseUrl}/GetCustomerAccountSummary`);
  }

  getById(id: number): Observable<Customer> {
    const url = `${this.baseUrl}/GetById/${id}`;
    return this.http.get<Customer>(url);
  }

  /**
   * Add a new customer
   */
  createCustomer(customer: Customer): Observable<Customer> {
    const url = `${this.baseUrl}/Post`;
    return this.http.post<Customer>(url, customer);
  }

  /**
   * Update an existing customer
   */
  updateCustomer(customer: Customer): Observable<void> {
    const url = `${this.baseUrl}/Put`;
    return this.http.put<void>(url, customer);
  }

  /**
   * Delete a customer by id
   */
  deleteCustomer(id: number): Observable<void> {
    const url = `${this.baseUrl}/Delete?id=${id}`;
    return this.http.delete<void>(url);
  }

  /**
   * Add a new contact person for a customer
   */
  addContact(contactPerson: CustomerContactPerson): Observable<CustomerContactPerson> {
    const url = `${this.baseUrl}/AddContact`;
    return this.http.post<CustomerContactPerson>(url, contactPerson);
  }

  /**
   * Remove a contact person by their id
   */
  deleteContact(contactPersonId: number): Observable<void> {
    const url = `${this.baseUrl}/DeleteContact?contactPersonId=${contactPersonId}`;
    return this.http.delete<void>(url);
  }

  /**
   * Get all contact persons for a specific customer
   */
  getContactsByCustomer(customerId: number): Observable<CustomerContactPerson[]> {
    const url = `${this.baseUrl}/GetContactsByCustomer?customerId=${customerId}`;
    return this.http.get<CustomerContactPerson[]>(url);
  }


}
