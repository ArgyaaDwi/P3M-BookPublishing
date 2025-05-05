import { InvoiceItem } from "./invoiceItem";
export type InvoiceType = {
  id: number;
  current_status_id: number;
  transaction_notes: string | null;
  transaction_ticket: string | null;
  status: {
    id: number;
    status_name: string;
  };
  is_shipped: boolean;
  user: {
    id: number;
    name: string;
  };
  payment_proof: string | null;
  createdAt: string;
  items: InvoiceItem[];
};
