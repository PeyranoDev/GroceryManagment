const ReportTable = ({ type, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-[var(--color-secondary-text)] uppercase bg-[var(--color-border)]">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Fecha</th>
            <th className="p-3">Total</th>
            <th className="p-3">{type === "compras" ? "Proveedor" : "Usuario"}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-[var(--color-border)]">
              <td className="p-3 font-medium text-white whitespace-nowrap">
                {row.id}
              </td>
              <td className="p-3 text-[var(--color-text)]">{new Date(row.date).toLocaleDateString("es-AR")}</td>
              <td className="p-3 font-mono text-[var(--color-text)] whitespace-nowrap">
                ${row.total.toFixed(2)}
              </td>
              <td className="p-3 text-[var(--color-text)]">
                {row.user || row.supplier}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
