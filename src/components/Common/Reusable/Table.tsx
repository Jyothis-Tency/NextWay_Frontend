import type React from "react";
import { useState } from "react";

type Column<T> = {
  key: keyof T | string;
  label: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  defaultRowsPerPage?: number;
};

const ReusableTable = <T,>({
  columns,
  data,
  defaultRowsPerPage = 0,
}: TableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(defaultRowsPerPage);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border-2 border-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#000000] text-white">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`p-3 text-sm font-semibold tracking-wide text-${
                  col.align || "left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {paginatedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-[#2a2a2a]" : "bg-[#2a2a2a]"}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`p-3 text-sm text-white text-${
                    col.align || "left"
                  }`}
                >
                  {col.render
                    ? col.render(row)
                    : (row[col.key as keyof T] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between p-3 bg-[#000000]">
        {/* <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Rows per page:</span>
          <select
            className="border rounded p-1 text-sm"
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
          >
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div> */}
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1 rounded bg-[#4F46E5] text-sm disabled:opacity-50"
            onClick={() => handleChangePage(page - 1)}
            disabled={page === 0}
          >
            Previous
          </button>
          <span className="text-sm text-white">
            Page {page + 1} of {Math.ceil(data.length / rowsPerPage)}
          </span>
          <button
            className="px-3 py-1 rounded bg-[#4F46E5] disabled:opacity-50"
            onClick={() => handleChangePage(page + 1)}
            disabled={page >= Math.ceil(data.length / rowsPerPage) - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReusableTable;
