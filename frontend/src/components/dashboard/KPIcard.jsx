import Card from "../ui/card/Card";
import "./dashboard.css";

const KPIcard = ({
  title,
  value,
  comparisonText,
  valueColor = "kpiCardValueDefault",
  comparisonColor = "kpiCardComparisonDefault",
}) => {
  return (
    <Card>
      <div className="p-3">
        <p className="kpiCardTitle">{title}</p>
        <p className={`kpiCardValue ${valueColor}`}>{value}</p>
      </div>
      <div className={`kpiCardComparison ${comparisonColor}`}>
        {comparisonText}
      </div>
    </Card>
  );
};

export default KPIcard;
