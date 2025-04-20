
export type InvoiceItem = {
    publication: {
      publication_title: string;
      lecturer: {
        name: string;
        nidn: string;
      };
      publication_book_cover: string;
      publication_authenticity_proof: string;
    };
    cost: number;
    quantity: number;
    total_cost: number;
  };
  