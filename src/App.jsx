import { useState, useMemo } from "react";
import * as XLSX from "xlsx";

export default function App() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const binaryStr = new Uint8Array(evt.target.result)
      .reduce((data, byte) => data + String.fromCharCode(byte), '');
      const workbook = XLSX.read(binaryStr, { type: "binary", cellStyles: true });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
      setColumns(Object.keys(jsonData[0] || {}));
    };
    reader.readAsArrayBuffer (file);
  };

  const sortedFilteredData = useMemo(() => {
    let filtered = data.filter((row) =>
      columns.some((col) =>
        String(row[col]).toLowerCase().includes(search.toLowerCase())
      )
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [data, search, sortConfig, columns]);

  const handleSort = (col) => {
    setSortConfig((prev) => {
      if (prev.key === col) {
        return { key: col, direction: prev.direction === "asc" ? "desc" : "asc" };
      } else {
        return { key: col, direction: "asc" };
      }
    });
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <label className="inline-block mb-4">
        <span className="text-sm font-semibold">Upload Excel File</span>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="block mt-2 w-full cursor-pointer border border-gray-600 rounded bg-gray-800 text-white px-4 py-2 hover:bg-gray-700"
        />
      </label>

      {data.length > 0 && (
        <>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 w-full border border-gray-600 rounded bg-gray-800 text-white px-4 py-2"
          />

          <div className="overflow-x-auto">
            <table className="min-w-max table-auto border-collapse w-full border border-gray-700 text-white">
              <thead className="bg-gray-800">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col}
                      onClick={() => handleSort(col)}
                      className="px-4 py-2 border border-gray-700 text-left font-medium text-gray-300 cursor-pointer select-none"
                    >
                      {col}
                      {sortConfig.key === col && (sortConfig.direction === "asc" ? " ▲" : " ▼")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedFilteredData.map((row, idx) => (
                  <tr key={idx} className="odd:bg-gray-900 even:bg-gray-800">
                    {columns.map((col) => (
                      <td
                        key={col}
                        className="px-4 py-2 border border-gray-700 text-gray-200 max-w-xs overflow-x-auto whitespace-nowrap"
                      >
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
