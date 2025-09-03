import { useDashboard, useLowStockCount } from "../../hooks/useDashboard";
import KPIcard from "./KPIcard";
import WeeklySalesChart from "./WeeklySalesChart";
import RecentActivity from "./RecentActivity";

const Dashboard = () => {
  const { stats, weeklySales, recentActivities, loading, error } = useDashboard();
  const lowStockCount = useLowStockCount();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-400">Cargando dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-400">Error: {error}</div>
      </div>
    );
  }
  
  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
        <KPIcard
          title={"Ventas de hoy"}
          value={stats?.todaySales || 0}
          comparisonText={stats?.todaySalesComparison || "Sin datos de comparación"}
          comparisonColor={stats?.todaySalesComparison?.includes('+') ? "text-green-400" : "text-red-400"}
        />
        <KPIcard
          title={"Ingresos del Mes"}
          value={stats?.monthlyRevenue ? `$${stats.monthlyRevenue.toFixed(2)}` : "$0.00"}
          comparisonText={stats?.monthlyRevenueComparison || "Sin datos de comparación"}
          comparisonColor={stats?.monthlyRevenueComparison?.includes('+') ? "text-green-400" : "text-red-400"}
          valueColor={"text-white"}
        />
        <KPIcard
          title={"Bajo Stock"}
          value={lowStockCount}
          comparisonText={"Productos con 10 o menos unidades"}
          valueColor={"text-yellow-400"}
          comparisonColor={"text-gray-400"}
        />
        <KPIcard
          title={"Ticket Promedio"}
          value={stats?.averageTicket ? `$${stats.averageTicket.toFixed(2)}` : "$0.00"}
          comparisonText={stats?.averageTicketComparison || "Sin datos de comparación"}
          valueColor={"text-white"}
          comparisonColor={stats?.averageTicketComparison?.includes('+') ? "text-green-400" : "text-red-400"}
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
