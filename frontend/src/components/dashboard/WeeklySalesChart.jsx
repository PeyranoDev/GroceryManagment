import { BarChart2 } from "lucide-react";
import "./dashboard.css";
import Card from "../ui/card/Card";

const WeeklySalesChart = ({ weeklySales = [] }) => {
  // Datos por defecto si no hay datos del backend
  const defaultData = [
    { day: 'Lun', sales: 0 },
    { day: 'Mar', sales: 0 },
    { day: 'Mié', sales: 0 },
    { day: 'Jue', sales: 0 },
    { day: 'Vie', sales: 0 },
    { day: 'Sáb', sales: 0 },
    { day: 'Dom', sales: 0 },
  ];

  const salesData = weeklySales.length > 0 ? weeklySales : defaultData;
  const maxSale = Math.max(...salesData.map((s) => s.sales));

  return (
    <Card
      title={
        <>
          <BarChart2 size={20} /> Ventas de la Semana
        </>
      }
      className="weeklySalesChart"
    >
      <div className="weeklySalesChart__container">
        {salesData.map((sale) => (
          <div
            key={sale.day}
            className="weeklySalesChart__dayColumn"
          >
            <div
              className="weeklySalesChart__bar"
              style={{
                height: maxSale > 0 ? `${(sale.sales / maxSale) * 228}px` : '0px',
              }}
            >
              <span className="weeklySalesChart__barValue">
                {sale.sales}
              </span>
            </div>
            <span className="weeklySalesChart__dayLabel">
              {sale.day}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WeeklySalesChart;
