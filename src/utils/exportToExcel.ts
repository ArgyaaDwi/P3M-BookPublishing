import * as XLSX from "xlsx";
/**
 * Ini untuk export data ke file Excel (.xlsx)
 * @param data Array of objects
 * @param filename Nama file tanpa ekstensi
 */
export const exportToExcel = <T extends object>(
  data: T[],
  filename: string = "data"
) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
