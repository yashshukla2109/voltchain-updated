import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Bell, Zap, TrendingUp, MessageCircle, DollarSign } from "lucide-react";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: "sale",
      icon: DollarSign,
      title: "Energy Sold",
      message: "Your 5.2 kWh listing was purchased by EcoPanel Pro",
      time: "2 hours ago",
      unread: true
    },
    {
      id: 2,
      type: "alert",
      icon: TrendingUp,
      title: "Price Alert",
      message: "Energy prices have increased by 5% in your region",
      time: "5 hours ago",
      unread: true
    },
    {
      id: 3,
      type: "energy",
      icon: Zap,
      title: "High Production Day",
      message: "Your solar panels generated 45.8 kWh today - 15% above average",
      time: "Yesterday",
      unread: false
    },
    {
      id: 4,
      type: "community",
      icon: MessageCircle,
      title: "New Comment",
      message: "GreenTechPro commented on your post",
      time: "Yesterday",
      unread: false
    },
    {
      id: 5,
      type: "sale",
      icon: DollarSign,
      title: "Bid Won",
      message: "You won the auction for 35.2 kWh from CleanEnergy Pro",
      time: "2 days ago",
      unread: false
    }
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case "sale": return "text-accent";
      case "alert": return "text-destructive";
      case "energy": return "text-primary";
      case "community": return "text-secondary";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mr-64 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Bell className="h-10 w-10" />
              Notifications
            </h1>
            <p className="text-muted-foreground">Stay updated with your energy activities</p>
          </header>

          <div className="space-y-3">
            {notifications.map((notification, idx) => (
              <Card
                key={notification.id}
                className={`p-6 bg-card/50 backdrop-blur-sm border-border animate-slide-up hover:scale-[1.01] transition-all duration-300 ${ notification.unread ? "border-l-4 border-l-primary" : "" }`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full bg-background/50 ${getIconColor(notification.type)}`}>
                    <notification.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-lg">{notification.title}</h4>
                      <span className="text-sm text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-muted-foreground">{notification.message}</p>
                    {notification.unread && (
                      <div className="mt-3">
                        <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full">
                          New
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Sidebar />
    </div>
  );
};

export default Notifications;
