import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState([]);
  const sheetId = '1Hp5fxHnonNc7ZhsyBcxkUmyXGjUM_GECHsTrfv--wq8'
  const sheetName = 'Sheet2'

  const fetchData = async () => {
    const res = await fetch(`https://opensheet.elk.sh/${sheetId}/${sheetName}`);
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

   if (data.length === 0) return <p className="p-4">Loading...</p>;

  const columnHeaders = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto p-4">
      <table className="table-auto border-collapse w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {columnHeaders.map((key) => (
              <th key={key} className="px-4 py-2 border border-gray-300 text-left font-medium">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="odd:bg-white even:bg-gray-50">
              {columnHeaders.map((key) => (
                <td key={key} className="px-4 py-2 border border-gray-300">
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
