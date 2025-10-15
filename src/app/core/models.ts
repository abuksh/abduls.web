export interface Customer {
  customerId: number;
  sCustomerId: string;
  name: string;
  companyNumber: string;
  street: string;
  district: string;
  postCode: string;
  city: string;
  country: string;
  region: string;
  poBox: string;
  telephone: string;
  extension: string;
  mobile: string;
  fax: string;
  email: string;
  webSite: string;
  isActive: boolean;
  paymentTermId: number;
  paymentTerm?: CustomerPaymentTerm;
  vehicles: Vehicle[];
  invoices: Invoice[];
  contactPersons: CustomerContactPerson[];
  lastUpdatedBy: string;
  updatedDate: Date;
  totalBalance: number;
}

export interface CustomerPaymentTerm {
  paymentTermId: number;
  description: string;
  numberOfDaysForPayment: number;
  customers: Customer[];
}

export interface Vehicle {
  vehicleId: number;
  registrationNumber: string;
  make: string;
  model: string;
  year: string;
  chasis: string;
  engineNumber: string;
  customerId: number;
  customer: Customer;
  isActive: boolean;
  vehicleDescription: string;
  fleetNumber: string | null;
  lastUpdatedBy: string | null;
  updatedDate: string;
}

export interface CustomerContactPerson {
  contactPersonId: number;
  description: string;
  telephone: string;
  extension: string;
  mobile: string;
  fax: string;
  email: string;
  customerId: number;
  customer: Customer;
}

interface Invoice {
  invoiceId: number;
  serviceType: string;
  sInvoiceId: string;
  documentType: string;
  allocateToInvoice: number;
  invoiceDate: Date;
  dueDate: Date;
  dateJobDone?: Date | null;
  currency: string;
  subTotal: number;
  taxAmount: number;
  amount: number;
  vehicleId?: number | null;
  vehicle: Vehicle;
  huboMeter?: number | null;
  speedoMeter?: number | null;
  cofDate?: Date | null;
  jobCardNumber?: number | null;
  comments: string;
  emailNotes: string;
  isPaid: boolean;
  customerId: number;
  customer: Customer;
  invoiceLineItems: InvoiceLineItem[];
  invoiceClearings: InvoiceClearing[];
  creditNotes: Invoice[];
  invoiceFileName: string;
  purchaseOrder: string;
  lastUpdatedBy: string;
  updatedDate: Date;
  nextServiceDate: number;
  totalPaymentRecieved: number;
  totalCreditNotesIssued: number;
  totalBalance: number;
  overDueAge: number;
  invoiceStatus: string;
}

export interface InvoiceClearing {
  id: number;
  paymentDate: string;
  referenceNumber: string;
  amount: number;
  notes: string;
  type: string;
  mode: string;
  invoiceId: number;
  invoice: Invoice;
  lastUpdatedBy: string;
  updatedDate: string;
}
export interface InvoiceLineItem {
  invoiceLineItemId: number;
  quantity: number;
  unitPrice: number;
  lineItemDescription: string;
  amount: number;
  baseUnitOfMeasureId: number;
  baseUnitOfMeasure: BaseUnitOfMeasure;
  invoiceId: number;
  invoiceHeader: Invoice;
  inventoryId: number;
  inventory: Inventory;
  rego: string;
}

export interface BaseUnitOfMeasure {
  baseUnitOfMeasureId: number;
  description: string;
}

export interface Inventory {
  inventoryId: number;
  sInventoryId: string;
  description: string;
  sDescription: string;
  partNumber: string;
  retailPrice: number;
  wholeSalePrice: number;
  isActive: boolean;
  location: string;
  inventoryCategoryId: number;
  inventoryCategory: InventoryCategory;
  baseUnitOfMeasureId: number;
  baseUnitOfMeasure: BaseUnitOfMeasure;
  invoiceLineItems: InvoiceLineItem[];
  transactions: InventoryTransaction[];
  lastUpdatedBy: string;
  updatedDate: string;
}

export interface InventoryCategory {
  inventoryCategoryId: number;
  description: string;
}


export interface InventoryTransaction {
  inventoryTransactionId: number;
  transactionDate: string;
  reference: number;
  referenceBasedOnType: string;
  quantity: number;
  inventoryTransactionTypeId: number;
  transactionType: InventoryTransactionType;
  inventoryId: number;
  inventory: Inventory;
  comments: string;
  lastUpdatedBy: string;
  updatedDate: string;
}


export interface InventoryTransactionType {
  inventoryTransactionTypeId: number;
  description: string;
  inventoryTransactions: InventoryTransaction[];
}

export interface CustomerSummaryWithBalances {
  customerId: number;
  sCustomerId: string;
  name: string;
  city: string;
  telephone: string;
  mobile: string;
  balance: number | null;
  vehicles: number | null;
}

export interface CustomerInvoicesViewModel {
  invoiceId: number;
  sInvoiceId: string;
  documentType: string;
  invoiceNumber: string;
  allocateToInvoice: number;
  invoiceDate: Date;
  type: string;
  dueDate: Date;
  invoiceTotal: number;
  payments: number;
  credits: number;
  balance: number;
  isOverDue: boolean;
  isPaid: boolean;
  customer: Customer;
  customerId: number;
  overDueAge: number;
  createDate: Date;
  jobCardNumber?: number; // Nullable field
  allocatedPayment: number;
  purchaseOrder: string;
  age: string; // This could be calculated on the front-end as needed
}

export interface Column {
  key: string;
  label: string;
  type?: 'text' | 'button';
  action?: (row: any) => void;
}

export interface CustomerAging {
  current: number;
  _30_days: number;
  _60_days: number;
  _60Plus_days: number;
  balance: number;
  customerId: number;
  customerName: string;
}

export interface InvoiceDto {
  invoiceId: number;
  serviceType: string;
  sInvoiceId: string;
  documentType: string;
  allocateToInvoice: number;
  invoiceDate: Date;
  dueDate: Date;
  dateJobDone?: Date | null;
  currency: string;
  subTotal: number;
  taxAmount: number;
  amount: number;
  vehicleId?: number | null;
  huboMeter?: number | null;
  speedoMeter?: number | null;
  cofDate?: Date | null;
  jobCardNumber?: number | null;
  comments: string;
  emailNotes: string;
  isPaid: boolean;
  customerId: number;
  lastUpdatedBy: string;
  updatedDate: Date;
  invoiceLineItems: InvoiceLineItemDto[];
}

export interface InvoiceLineItemDto {
  invoiceLineItemId: number;
  quantity: number;
  unitPrice: number;
  lineItemDescription: string;
  amount: number;
  baseUnitOfMeasureId: number;
  baseUnitOfMeasureName?: string;
  invoiceId: number;
  invoiceHeaderDetails?: string;
  inventoryId: number;
  inventoryName?: string;
  rego?: string;
  changeState: LineItemChangeState;
}

export enum LineItemChangeState {
  Unchanged = "Unchanged",
  Added = "Added",
  Modified = "Modified",
  Deleted = "Deleted"
}
