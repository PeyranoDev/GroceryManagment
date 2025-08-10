import { useState } from "react";
import { Download, FileText } from "lucide-react";
import Card from "../ui/card/Card";
import Select from "../ui/select/Select";
import ReportTable from "./ReportTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { mockReportData } from "../../data/products";



const prettyTitle = {
  ventas: "Ventas",
  compras: "Compras",
  inventario: "Inventario",
};

const filterDataByType = (type, data) => {
  if (type === "compras") return data.filter((d) => d.id.startsWith("C"));
  if (type === "ventas") return data.filter((d) => d.id.startsWith("V"));
  return []; // Inventario u otros no simulados
};

const Reports = () => {
  const [reportType, setReportType] = useState("ventas");
  const [dateRange, setDateRange] = useState([null, null]);
  const [generatedReport, setGeneratedReport] = useState(null);

  const [startDate, endDate] = dateRange;

  const isGenerateDisabled = !startDate || !endDate || startDate > endDate;

  const handleGenerate = () => {
    const filtered = filterDataByType(reportType, mockReportData);
    setGeneratedReport({
      type: reportType,
      data: filtered,
    });
  };

  return (
    <div className="space-y-6">
      <Card
        title={
          <>
            <FileText size={22} /> Generador de Reportes
          </>
        }
        actions={
          <button
            onClick={handleGenerate}
            className="btn-secondary "
            disabled={isGenerateDisabled}
          >
            Generar Reporte
          </button>
        }
      >
        <div className="flex  gap-4 ">
          {/* Selector de tipo de reporte */}
          <div className="flex flex-col md:w-1/4">
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Tipo de Reporte
            </label>
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="ventas">Ventas</option>
              <option value="compras">Compras</option>
              <option value="inventario">Inventario</option>
            </Select>
          </div>

          {/* Selector de rango de fechas */}
          <div className="flex flex-col  ">
            <label className=" text-sm font-medium text-[var(--color-text)] mb-1">
              Rango de Fechas
            </label>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Seleccionar rango de fechas"
              className="!w-60 pl-3"
              isClearable
              locale="es"
            />
          </div>
        </div>
      </Card>

      {generatedReport && (
        <Card
          title={`Reporte de ${prettyTitle[generatedReport.type]}`}
          actions={
            <button className="btn-secondary">
              <Download size={16} />
              Exportar
            </button>
          }
        >
          {generatedReport.data.length === 0 ? (
            <div className="p-4 text-sm text-[var(--color-secondary-text)]">
              No se encontraron resultados para este reporte.
            </div>
          ) : (
            <ReportTable
              type={generatedReport.type}
              data={generatedReport.data}
            />
          )}
        </Card>
      )}
    </div>
  );
};

export default Reports;
