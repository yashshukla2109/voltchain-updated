import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Zap, TrendingUp, TrendingDown, Battery } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { useState } from "react";

// Helper to generate random number in range
const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1));

// Delhi districts (example)
const delhiDistricts = [
  "Rohini West", "Rohini East", "Dwarka", "Saket", "Vasant Kunj",
  "Karol Bagh", "Rajouri Garden", "Janakpuri", "Punjabi Bagh", "Pitampura"
];

// Generate 1000 random users
const generateUsers = () => {
  const users: { name: string; district: string; data: { day: string; generated: number; consumed: number; surplus: number }[] }[] = [];
  for (let i = 1; i <= 1000; i++) {
    const district = delhiDistricts[randomBetween(0, delhiDistricts.length - 1)];
    const data = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => {
      const generated = randomBetween(30, 70);
      const consumed = randomBetween(0, generated); // consumed ≤ generated
      const surplus = generated - consumed;          // surplus ≤ generated
      return { day, generated, consumed, surplus };
    });
    users.push({ name: `User ${i}`, district, data });
  }
  return users;
};

const users = generateUsers();

const Dashboard = () => {
  const energyData = {
    generated: 45.8,
    consumed: 28.3,
    remaining: 17.5,
    trend: 12.5,
  };

  const [district, setDistrict] = useState("All");
  const [userIndex, setUserIndex] = useState(0);

  // Filter users by selected district
  const filteredUsers =
    district === "All"
      ? users
      : users.filter((user) => user.district === district);

  const selectedUser = filteredUsers[userIndex] || filteredUsers[0];

  return (
    <div className="min-h-screen">
      <div className="mr-64 p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2">Energy Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor solar energy production, consumption, and surplus by district
            </p>
          </header>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:scale-105 transition-transform duration-300 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Generated Today</h3>
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <p className="text-3xl font-bold mb-2">{energyData.generated} kWh</p>
              <p className="text-sm text-accent flex items-center gap-1">
                <TrendingUp className="h-4 w-4" /> +{energyData.trend}% from yesterday
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:scale-105 transition-transform duration-300 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Consumed Today</h3>
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <p className="text-3xl font-bold mb-2">{energyData.consumed} kWh</p>
              <p className="text-sm text-muted-foreground">Within expected range</p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:scale-105 transition-transform duration-300 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Available to Trade</h3>
                <Battery className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold mb-2">{energyData.remaining} kWh</p>
              <p className="text-sm text-primary">Ready for marketplace</p>
            </Card>
          </div>

          {/* District & User Filter */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border animate-slide-up mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1">Filter by District</label>
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setUserIndex(0); // reset user index when district changes
                  }}
                  className="p-2 border border-gray-300 rounded-md bg-card/70 text-sm font-medium cursor-pointer"
                >
                  <option value="All">All Districts</option>
                  {delhiDistricts.map((d, idx) => (
                    <option key={idx} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1">Select User</label>
                <select
                  value={userIndex}
                  onChange={(e) => setUserIndex(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-md bg-card/70 text-sm font-medium cursor-pointer"
                >
                  {filteredUsers.map((user, idx) => (
                    <option key={idx} value={idx}>
                      {user.name} - {user.district}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* User Energy Graph Section */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border animate-slide-up">
            <h3 className="text-xl font-bold mb-4">{selectedUser.name} - {selectedUser.district}</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={selectedUser.data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="generated" stroke="#16a34a" strokeWidth={2} />
                <Line type="monotone" dataKey="consumed" stroke="#dc2626" strokeWidth={2} />
                <Line type="monotone" dataKey="surplus" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
      <Sidebar />
    </div>
  );
};

export default Dashboard;
