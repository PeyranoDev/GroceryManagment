import { useMemo } from "react";
import { mockRecentActivity, mockWeeklySales } from "../../data/products";
import KPIcard from "./KPIcard";
import WeeklySalesChart from "./WeeklySalesChart";
import RecentActivity from "./RecentActivity";

const Dashboard = ({ inventoryData }) => {
  const lowStockCount = useMemo(
    () => inventoryData.filter((p) => p.stock > 0 && p.stock <= 10).length,
    [inventoryData]
  );
  
  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
        <KPIcard
          title={"Ventas de hoy"}
          value={12}
          comparisonText={"+5% que ayer"}
          comparisonColor={"text-green-600 dark:text-green-400"}
        />
        <KPIcard
          title={"Ingresos del Mes"}
          value={"$1,250.00"}
          comparisonText={"+12% vs mes anterior"}
          comparisonColor={"text-green-600 dark:text-green-400"}
          valueColor={"text-gray-900 dark:text-white"}
        />
        <KPIcard
          title={"Bajo Stock"}
          value={lowStockCount}
          comparisonText={"Productos con 10 o menos unidades"}
          valueColor={"text-yellow-600 dark:text-yellow-400"}
          comparisonColor={"text-gray-500 dark:text-gray-400"}
        />
        <KPIcard
          title={"Ticket Promedio"}
          value={"$104.17"}
          comparisonText={"-2% vs ayer"}
          valueColor={"text-gray-900 dark:text-white"}
          comparisonColor={"text-red-600 dark:text-red-400"}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WeeklySalesChart mockWeeklySales={mockWeeklySales}/>
        <RecentActivity mockRecentActivity={mockRecentActivity} />
      </div>
    </div>
  );
};

export default Dashboard;
