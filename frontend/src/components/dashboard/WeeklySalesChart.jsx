import { BarChart2 } from "lucide-react";
import "./dashboard.css";
import Card from "../ui/card/Card";

const WeeklySalesChart = ({ mockWeeklySales }) => {
  const maxSale = Math.max(...mockWeeklySales.map((s) => s.sales));

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
        {mockWeeklySales.map((sale) => (
          <div
            key={sale.day}
            className="weeklySalesChart__dayColumn"
          >
            <div
              className="weeklySalesChart__bar"
              style={{
                height: `${(sale.sales / maxSale) * 228}px`,
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
