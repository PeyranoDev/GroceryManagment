import { useDashboard } from "../../hooks/useDashboard";
import { formatCurrencyAR } from "../../utils/money";
import KPIcard from "./KPIcard";
import WeeklySalesChart from "./WeeklySalesChart";
import RecentActivity from "./RecentActivity";

const Dashboard = () => {
  const { stats, weeklySales, recentActivities, loading, error } = useDashboard();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-[var(--color-secondary-text)]">Cargando dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-[var(--color-error)]">Error: {error}</div>
      </div>
    );
  }
  
  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
        <KPIcard
          title={"Ventas de hoy"}
          value={Number(stats?.todaySales || 0).toLocaleString('es-AR')}
          comparisonText={stats?.todaySalesComparison || "Sin datos de comparación"}
          comparisonColor={stats?.todaySalesComparison?.includes('+') ? "text-[var(--color-success)]" : "text-[var(--color-error)]"}
        />
        <KPIcard
          title={"Ingresos del Mes"}
          value={`$${formatCurrencyAR(stats?.monthlyRevenue || 0)}`}
          comparisonText={stats?.monthlyRevenueComparison || "Sin datos de comparación"}
          comparisonColor={stats?.monthlyRevenueComparison?.includes('+') ? "text-[var(--color-success)]" : "text-[var(--color-error)]"}
          valueColor={"text-[var(--color-text)]"}
        />
        <KPIcard
          title={"Bajo Stock"}
          value={stats?.lowStockCount || 0}
          comparisonText={"Productos con 10 o menos unidades"}
          valueColor={"text-[var(--color-warning)]"}
          comparisonColor={"text-[var(--color-secondary-text)]"}
        />
        <KPIcard
          title={"Ticket Promedio"}
          value={`$${formatCurrencyAR(stats?.averageTicket || 0)}`}
          comparisonText={stats?.averageTicketComparison || "Sin datos de comparación"}
          valueColor={"text-[var(--color-text)]"}
          comparisonColor={stats?.averageTicketComparison?.includes('+') ? "text-[var(--color-success)]" : "text-[var(--color-error)]"}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WeeklySalesChart weeklySales={weeklySales} />
        <RecentActivity recentActivities={recentActivities} />
      </div>
    </div>
  );
};

export default Dashboard;
