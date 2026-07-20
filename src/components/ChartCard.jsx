import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function ChartCard({ chartData, COLORS }) {
  return (
    <div className="chart-card">

      <h3>📊 Görev Dağılımı</h3>

      <ResponsiveContainer width="100%" height={160}>

        <PieChart>

          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={68}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}

export default ChartCard;