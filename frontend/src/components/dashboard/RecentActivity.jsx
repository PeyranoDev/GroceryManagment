import { Package, Save, ShoppingCart } from "lucide-react";
import "./dashboard.css";
import Card from "../ui/card/Card";

const RecentActivity = ({ mockRecentActivity }) => {
  return (
    <Card title="Actividad Reciente">
      <ul className="recentActivity__list">
        {mockRecentActivity.map((activity) => (
          <li key={activity.id} className="recentActivity__item">
            <div className="recentActivity__iconContainer">
              {activity.type === "Venta" ? (
                <ShoppingCart size={16} />
              ) : activity.type === "Inventario" ? (
                <Package size={16} />
              ) : (
                <Save size={16} />
              )}
            </div>
            <div>
              <p className="recentActivity__description">
                {activity.description}
              </p>
              <p className="recentActivity__details">
                {activity.time} por {activity.user}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default RecentActivity;