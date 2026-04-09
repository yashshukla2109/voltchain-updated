import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Gavel, 
  User, 
  TrendingUp, 
  Users, 
  Wallet as WalletIcon,
  Bell,
  Moon,
  Sun,
  Zap,
  MessageSquareText // ✅ Added for optional Chatbot icon
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

// ✅ Combined and Enhanced Navigation Items
const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Marketplace", path: "/marketplace", icon: ShoppingCart },
  { name: "Bidding", path: "/bidding", icon: Gavel },
  { name: "Market Analysis", path: "/market-analysis", icon: TrendingUp },
  { name: "Community", path: "/community", icon: Users },
  { name: "Wallet", path: "/wallet", icon: WalletIcon },
  { name: "Notifications", path: "/notifications", icon: Bell },
  // --- NEW CHATBOT / HELP SECTION ---
  { name: "Help (Chatbot)", path: "/chatbot", icon: Zap },
  // You can switch the icon if you prefer a more chat-like look:
  // { name: "Help (Chatbot)", path: "/chatbot", icon: MessageSquareText },
  // ------------------------------------
  { name: "Account", path: "/account", icon: User },
];

export const Sidebar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <aside className="fixed right-0 top-0 h-screen w-64 border-l border-border bg-card/50 backdrop-blur-xl z-50 flex flex-col">
      {/* --- Branding --- */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Zap className="h-8 w-8 text-primary animate-pulse-glow" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            VoltChain
          </h1>
        </div>
      </div>

      {/* --- Navigation Links --- */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "hover:bg-sidebar-accent hover:shadow-md",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg glow-primary"
                  : "text-sidebar-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* --- Theme Switcher --- */}
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full gap-2"
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              Dark Mode
            </>
          )}
        </Button>
      </div>
    </aside>
  );
};
