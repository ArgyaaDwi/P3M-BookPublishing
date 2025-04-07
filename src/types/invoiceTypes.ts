export type InvoiceType = {
    id: number;
    current_status_id: number;
    transaction_notes: string | null;
    status: {
      id: number;
      status_name: string;
    };
    user: {
      id: number;
      name: string;
    };
   createdAt: string;
  };
  