import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { TrendingUp, DollarSign, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface PriceData {
  day: string;
  Morning: number;
  Afternoon: number;
  Evening: number;
  Night: number;
}

interface Insight {
  title: string;
  description: string;
  trend: "up" | "down" | "neutral";
}

const MarketAnalysis: React.FC = () => {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");

  // ---------- DATA ----------
  const dataWeek: PriceData[] = [
    { day: "Mon", Morning: 1.55, Afternoon: 1.60, Evening: 1.65, Night: 1.50 },
    { day: "Tue", Morning: 1.58, Afternoon: 1.62, Evening: 1.66, Night: 1.54 },
    { day: "Wed", Morning: 1.57, Afternoon: 1.63, Evening: 1.68, Night: 1.56 },
    { day: "Thu", Morning: 1.59, Afternoon: 1.65, Evening: 1.70, Night: 1.57 },
    { day: "Fri", Morning: 1.60, Afternoon: 1.66, Evening: 1.71, Night: 1.58 },
    { day: "Sat", Morning: 1.62, Afternoon: 1.68, Evening: 1.73, Night: 1.60 },
    { day: "Sun", Morning: 1.61, Afternoon: 1.67, Evening: 1.72, Night: 1.59 },
  ];

  const dataMonth: PriceData[] = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    Morning: Number((1.5 + Math.random() * 0.3).toFixed(2)),
    Afternoon: Number((1.55 + Math.random() * 0.3).toFixed(2)),
    Evening: Number((1.6 + Math.random() * 0.3).toFixed(2)),
    Night: Number((1.45 + Math.random() * 0.3).toFixed(2)),
  }));

  const dataYear: PriceData[] = [
    { day: "Jan", Morning: 1.50, Afternoon: 1.52, Evening: 1.55, Night: 1.48 },
    { day: "Feb", Morning: 1.52, Afternoon: 1.54, Evening: 1.57, Night: 1.50 },
    { day: "Mar", Morning: 1.54, Afternoon: 1.56, Evening: 1.59, Night: 1.52 },
    { day: "Apr", Morning: 1.56, Afternoon: 1.58, Evening: 1.61, Night: 1.54 },
    { day: "May", Morning: 1.65, Afternoon: 1.68, Evening: 1.72, Night: 1.60 },
    { day: "Jun", Morning: 1.70, Afternoon: 1.73, Evening: 1.77, Night: 1.65 },
    { day: "Jul", Morning: 1.75, Afternoon: 1.78, Evening: 1.82, Night: 1.70 },
    { day: "Aug", Morning: 1.73, Afternoon: 1.76, Evening: 1.80, Night: 1.68 },
    { day: "Sep", Morning: 1.65, Afternoon: 1.68, Evening: 1.72, Night: 1.60 },
    { day: "Oct", Morning: 1.60, Afternoon: 1.63, Evening: 1.67, Night: 1.58 },
    { day: "Nov", Morning: 1.55, Afternoon: 1.58, Evening: 1.62, Night: 1.54 },
    { day: "Dec", Morning: 1.52, Afternoon: 1.55, Evening: 1.59, Night: 1.50 },
  ];

  const chartData =
    period === "week" ? dataWeek : period === "month" ? dataMonth : dataYear;

  const insights: Insight[] = [
    {
      title: "Peak Demand Hours",
      description: "6-9 PM shows highest trading activity",
      trend: "up",
    },
    {
      title: "Weekend Surplus",
      description: "Lower consumption on weekends creates opportunities",
      trend: "neutral",
    },
    {
      title: "Solar Production",
      description: "Clear weather forecasted, expect price decrease",
      trend: "down",
    },
    {
      title: "Network Activity",
      description: "45% increase in active traders this week",
      trend: "up",
    },
  ];

  // ---------- RENDER ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="mr-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2">Market Analysis</h1>
            <p className="text-muted-foreground">
              Real-time electricity market insights
            </p>
          </header>

          {/* Top Metrics */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border card-shadow hover:scale-105 transition-transform duration-300 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Current Price
                </h3>
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <p className="text-3xl font-bold mb-2">
                ${chartData[chartData.length - 1].Evening.toFixed(2)}
              </p>
              <p className="text-sm text-accent flex items-center gap-1">
                <TrendingUp className="h-4 w-4" /> +3.2% from previous
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border card-shadow hover:scale-105 transition-transform duration-300 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  24h Volume
                </h3>
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold mb-2">2,458 kWh</p>
              <p className="text-sm text-muted-foreground">Across 142 trades</p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border card-shadow hover:scale-105 transition-transform duration-300 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Avg. Price
                </h3>
              </div>
              <p className="text-3xl font-bold mb-2">
                $
                {(
                  chartData.reduce(
                    (sum, d) =>
                      sum + d.Morning + d.Afternoon + d.Evening + d.Night,
                    0
                  ) /
                  (chartData.length * 4)
                ).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Over selected period
              </p>
            </Card>
          </div>

          {/* Chart + Insights */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border card-shadow animate-slide-up">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Price History</h3>
                <div className="flex gap-2">
                  {["week", "month", "year"].map((p) => (
                    <button
                      key={p}
                      onClick={() =>
                        setPeriod(p as "week" | "month" | "year")
                      }
                      className={`px-3 py-1 rounded ${
                        period === p
                          ? "bg-accent text-black font-bold"
                          : "bg-background text-white"
                      }`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis dataKey="day" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Morning"
                      stroke="#f97316"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="Afternoon"
                      stroke="#eab308"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="Evening"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="Night"
                      stroke="#6366f1"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Market Insights */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border card-shadow animate-slide-up">
              <h3 className="text-xl font-bold mb-4">Market Insights</h3>
              <div className="space-y-4">
                {insights.map((insight, idx) => (
                  <div key={idx} className="p-4 bg-background/50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold">{insight.title}</h4>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          insight.trend === "up"
                            ? "bg-accent/20 text-accent"
                            : insight.trend === "down"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {insight.trend}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Sidebar />
    </div>
  );
};

export default MarketAnalysis;
