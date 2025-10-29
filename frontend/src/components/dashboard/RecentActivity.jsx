import { Package, Save, ShoppingCart } from "lucide-react";
import "./dashboard.css";

import { Clock } from "lucide-react";
import Card from "../ui/card/Card";

const RecentActivity = ({ recentActivities = [] }) => {
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Sin fecha';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'hace un momento';
    if (diffInMinutes < 60) return `hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  };

  return (
    <Card
      title={
        <>
          <Clock size={20} /> Actividad Reciente
        </>
      }
    >
      <div className="space-y-4">
        {recentActivities.length > 0 ? (
          recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-[var(--surface)] border border-[var(--color-border)]"
            >
              <div className="flex-shrink-0 w-2 h-2 mt-2 bg-[var(--color-secondary)] rounded-full"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[var(--color-primary)]">
                    {activity.type}
                  </span>
                  <span className="text-xs text-[var(--color-secondary-text)]">
                    {getTimeAgo(activity.timestamp || activity.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text)]">
                  {activity.description}
                </p>
                {activity.user && (
                  <p className="text-xs text-[var(--color-secondary-text)] mt-1">
                    Por: {activity.user.name || activity.user}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Clock size={48} className="mx-auto mb-4 text-[var(--color-secondary-text)]" />
            <p className="text-sm text-[var(--color-secondary-text)]">
              No hay actividad reciente
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentActivity;
