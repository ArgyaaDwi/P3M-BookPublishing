export type PublicationType = {
  id: number;
  publication_ticket: string;
  publication_title: string;
  publication_document: string;
  current_status_id: number ;
  current_transaction_status_id: number;
  supporting_url?: string;
  publication_final_book?: string | null;
  createdAt: string;
  updatedAt: string;
  status: {
    id: number;
    status_name: string;
  };
  status_transaction: {
    id: number;
    status_name: string;
  };
  lecturer: {
    id: number;
    email: string;
    phone_number: string | null;
    name: string;
    nidn: string | null;
  };
  publisher: {
    id: number;
    name: string;
  };
  publication_book_cover: string | null;
  publication_authenticity_proof: string | null;
  items?: Array<{
    id: number;
    transaction?: {
      status?: {
        status_name: string | null;
      };
    };
  }>;
};
