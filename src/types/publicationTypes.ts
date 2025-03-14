export type PublicationType = {
  id: number;
  publication_ticket: string;
  publication_title: string;
  publication_document: string;
  current_status_id: number;
  supporting_url?: string;
  createdAt: string;
  updatedAt: string;
  status: {
    id: number;
    status_name: string;
  };
  lecturer: {
    id: number;
    name: string;
  };
  publisher: {
    id: number;
    name: string;
  };
};
