import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

function ChartCard({ chartData, COLORS, texts }) {
  return (
    <div className="chart-card">

      <h3>
        <PieChartIcon size={22} />
        {texts.chart.title}
      </h3>

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