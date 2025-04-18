
export type InvoiceItem = {
    publication: {
      publication_title: string;
      lecturer: {
        name: string;
        nidn: string;
      };
    };
    cost: number;
    quantity: number;
    total_cost: number;
  };
  