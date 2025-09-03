import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { useReports } from "../../hooks/useReports";
import Card from "../ui/card/Card";
import Select from "../ui/select/Select";
import ReportTable from "./ReportTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const prettyTitle = {
  ventas: "Ventas",
  compras: "Compras",
  inventario: "Inventario",
};

const Reports = () => {
  const { reports, loading, getFilteredReports, getSalesSummary, getTotalSales, getTotalPurchases } = useReports();
  const [reportType, setReportType] = useState("ventas");
  const [dateRange, setDateRange] = useState([null, null]);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [startDate, endDate] = dateRange;

  const isGenerateDisabled = !startDate || !endDate || startDate > endDate || isGenerating;

  const handleGenerate = async () => {
    if (isGenerateDisabled) return;

    setIsGenerating(true);
    
    try {
      const filters = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        type: reportType,
      };

      let reportData = [];

      if (reportType === 'ventas') {
        reportData = await getFilteredReports({
          ...filters,
          type: 'sales'
        });
      } else if (reportType === 'compras') {
        reportData = await getFilteredReports({
          ...filters,
          type: 'purchases'
        });
      } else if (reportType === 'inventario') {
        reportData = await getSalesSummary();
      }

      setGeneratedReport({
        type: reportType,
        data: Array.isArray(reportData) ? reportData : [],
        filters
      });
    } catch (error) {
      console.error('Error generating report:', error);
      alert(`Error al generar reporte: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (!generatedReport || !generatedReport.data.length) return;

    const headers = Object.keys(generatedReport.data[0]).join(',');
    const rows = generatedReport.data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `reporte_${generatedReport.type}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
            className="btn-secondary"
            disabled={isGenerateDisabled}
          >
            {isGenerating ? 'Generando...' : 'Generar Reporte'}
          </button>
        }
      >
        <div className="flex gap-4">
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
          <div className="flex flex-col">
            <label className="text-sm font-medium text-[var(--color-text)] mb-1">
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
            <button 
              className="btn-secondary"
              onClick={handleExport}
              disabled={!generatedReport.data.length}
            >
              <Download size={16} />
              Exportar CSV
            </button>
          }
        >
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-lg text-gray-400">Cargando reporte...</div>
            </div>
          ) : generatedReport.data.length === 0 ? (
            <div className="p-4 text-sm text-[var(--color-secondary-text)]">
              No se encontraron resultados para este reporte en el rango de fechas seleccionado.
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
