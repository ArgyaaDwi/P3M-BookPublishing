import jsPDF from "jspdf";
import autoTable, { CellInput } from "jspdf-autotable";
/**
 * Ini untuk export data ke file PDF
 * @param options.head Array of header (misalnya: [["No", "Nama", ...]])
 * @param options.body Array of isi baris (misalnya: [[1, "Chomu", ...]])
 * @param options.filename Nama file PDF (tanpa ekstensi)
 */
export const exportToPDF = ({
  head,
  body,
  filename = "data",
}: {
  head: CellInput[][];
  body: CellInput[][];
  filename?: string;
}) => {
  const doc = new jsPDF();
  autoTable(doc, {
    head,
    body,
  });
  doc.save(`${filename}.pdf`);
};
