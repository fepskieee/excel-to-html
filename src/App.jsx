import { useState } from "react";
import * as XLSX from "xlsx";

export default function App() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const binaryStr = new Uint8Array(evt.target.result)
    .reduce((data, byte) => data + String.fromCharCode(byte), '');
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
      setColumns(Object.keys(jsonData[0] || {}));
    };
    reader.readAsArrayBuffer(file);
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
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse w-full border border-gray-700 text-white">
            <thead className="bg-gray-800">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2 border border-gray-700 text-left font-medium text-gray-300"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="odd:bg-gray-900 even:bg-gray-800">
                  {columns.map((col) => (
                    <td
                      key={col}
                      className="px-4 py-2 border border-gray-700 text-gray-200"
                    >
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
