// src/components/SlidingUserGraphs.tsx

import { useKeenSlider } from "keen-slider/react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "keen-slider/keen-slider.min.css";

const userEnergyStats = [
  {
    user: "Alice",
    data: [32, 45, 38, 52, 48, 45, 58],
  },
  {
    user: "Bob",
    data: [28, 34, 31, 44, 42, 39, 50],
  },
  {
    user: "Charlie",
    data: [20, 22, 19, 25, 30, 28, 35],
  },
  {
    user: "Dana",
    data: [40, 48, 44, 51, 49, 50, 60],
  },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SlidingUserGraphs = () => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    slides: {
      perView: 1,
      spacing: 16,
    },
  });

  const generateChartData = (data: number[]) =>
    days.map((day, index) => ({
      day,
      kWh: data[index],
    }));

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">User Energy Comparison</h2>
      <div ref={sliderRef} className="keen-slider">
        {userEnergyStats.map((user, index) => (
          <div className="keen-slider__slide bg-card/50 p-6 rounded-lg shadow-md" key={index}>
            <h3 className="text-lg font-semibold mb-2">{user.user}'s Weekly Energy</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={generateChartData(user.data)}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="kWh" stroke="#4ade80" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlidingUserGraphs;
