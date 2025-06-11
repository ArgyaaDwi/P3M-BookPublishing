export type InvoiceItem = {
  id: number;
  publication: {
    id: number;
    publication_title: string;
    lecturer: {
      name: string;
      nidn: string;
    };
    publication_book_cover: string;
    publication_authenticity_proof: string;
    current_status_id: number;
  };
  cost: number;
  quantity: number;
  total_cost: number;
};
