export type RecordStatus =
  | 'ACTIVE'
  | 'INACTIVE';


export type PaymentStatus =
  | 'PAID'
  | 'PARTIAL'
  | 'UNPAID';


export interface AdminParent {

  id: number;

  fullName: string;

  email: string;

  phone: string;

  status: RecordStatus;

}


export interface AdminPlayer {

  id: number;

  parentId: number;

  firstName: string;

  lastName: string;

  program:
    | 'Foundations'
    | 'Development'
    | 'Competitive';

  status: RecordStatus;

}


export interface AdminPayment {

  id: number;

  playerId: number;

  month: string;

  expectedAmount: number;

  paidAmount: number;

  status: PaymentStatus;

  paidAt?: string;

}

export interface AdminUser {

  id: number;

  fullName: string;

  email: string;

  phone?: string;

  status: RecordStatus;

}