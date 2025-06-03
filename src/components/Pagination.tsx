type PaginationProps = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (limit: number) => void;
};

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Tampilkan:</label>
          <select
            className="border border-gray-600 rounded px-2 py-1 text-sm text-gray-600"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={totalItems}>Semua</option>
          </select>
        </div>
        <span className="text-sm text-black">
          Menampilkan{" "}
          {Math.min(
            itemsPerPage,
            totalItems - (currentPage - 1) * itemsPerPage
          )}{" "}
          dari {totalItems} entri
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-600 rounded disabled:opacity-50 text-gray-600"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => onPageChange(i + 1)}
            className={`px-3 py-1 border border-gray-600 rounded ${
              currentPage === i + 1
                ? "bg-primary text-white"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-600 rounded disabled:opacity-50 text-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
