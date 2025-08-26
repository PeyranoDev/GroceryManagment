import Card from "../ui/card/Card";

const KPIcard = ({
  title,
  value,
  comparisonText,
  valueColor = "text-text",
  comparisonColor = "text-text-secondary",
}) => {
  return (
    <Card>
      <div className="p-3">
        <p className="text-sm text-text-secondary font-medium mb-2">{title}</p>
        <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      </div>
      <div className={`px-3 pb-3 text-sm ${comparisonColor}`}>
        {comparisonText}
      </div>
    </Card>
  );
};

export default KPIcard;
