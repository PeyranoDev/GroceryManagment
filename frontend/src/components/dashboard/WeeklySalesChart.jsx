import { BarChart2 } from "lucide-react";
import "./dashboard.css";
import Card from "../ui/card/Card";

const WeeklySalesChart = ({ weeklySales = [] }) => {
  // Generate dynamic default data for last 7 days
  const generateDefaultData = () => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const today = new Date();
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      data.push({
        day: days[date.getDay()],
        sales: 0
      });
    }
    return data;
  };

  const defaultData = generateDefaultData();
  const salesData = weeklySales.length > 0 ? weeklySales : defaultData;
  const maxSale = Math.max(...salesData.map((s) => s.sales));

  // Check if today is the last day (rightmost)
  const todayAbbr = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][new Date().getDay()];

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
        {salesData.map((sale, index) => {
          const isToday = index === salesData.length - 1 && sale.day === todayAbbr;
          return (
            <div
              key={`${sale.day}-${index}`}
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
              <span className={`weeklySalesChart__dayLabel ${isToday ? 'weeklySalesChart__dayLabel--today' : ''}`}>
                {sale.day}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default WeeklySalesChart;
