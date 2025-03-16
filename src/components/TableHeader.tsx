import React from "react";

interface TableHeaderProps {
  columns: string[];
}

const TableHeader: React.FC<TableHeaderProps> = ({ columns }) => {
  return (
    <tr>
      {columns.map((col, index) => (
        <th
          key={index}
          className="p-4 text-base font-semibold bg-gray-50 text-gray-600 border text-left"
        >
          {col}
        </th>
      ))}
    </tr>
  );
};

export default TableHeader;
