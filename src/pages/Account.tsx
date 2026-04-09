import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, LogOut, Lock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const [profile, setProfile] = useState<any>({});
  const [panel, setPanel] = useState<any>({});
  const [panelLoaded, setPanelLoaded] = useState(false);
  const [panelInputs, setPanelInputs] = useState({
    capacity: "",
    efficiency: "",
    install_date: "",
    manufacturer: "",
  });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/login");

      // Fetch profile
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (profileData) setProfile(profileData);
      else {
        await supabase.from("profiles").insert({ id: user.id, email: user.email });
        setProfile({ id: user.id, email: user.email });
      }

      // Fetch solar panel (read-only)
      const { data: panelData } = await supabase.from("panels").select("*").eq("user_id", user.id).single();
      if (panelData) {
        setPanel(panelData);
        setPanelLoaded(true); // user already has panel data
      }

      setLoading(false);
    };
    loadData();
  }, [navigate]);

  const handleProfileChange = (e: any) => setProfile({ ...profile, [e.target.id]: e.target.value });
  const handlePasswordChange = (e: any) => setPasswords({ ...passwords, [e.target.id]: e.target.value });
  const handlePanelChange = (e: any) => setPanelInputs({ ...panelInputs, [e.target.id]: e.target.value });

  const saveProfile = async () => {
    await supabase.from("profiles").update(profile).eq("id", profile.id);
    alert("Personal info updated ✅");
    navigate("/dashboard"); // redirect after update
  };

  const savePanel = async () => {
    if (panelLoaded) return alert("You can only add panel details once");

    const { data, error } = await supabase
      .from("panels")
      .insert([{ user_id: profile.id, ...panelInputs }])
      .select()
      .single();

    if (error) return alert(error.message);
    if (data) {
      alert("Solar panel details saved ✅");
      setPanel(data);
      setPanelLoaded(true);
    }
  };

  const updatePassword = async () => {
    if (passwords.new !== passwords.confirm) return alert("New passwords do not match");
    const { error } = await supabase.auth.updateUser({ password: passwords.new });
    if (error) alert(error.message);
    else alert("Password updated ✅");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) return <p className="p-8 text-center">Loading...</p>;

  return (
    <div className="min-h-screen gradient-cosmic">
      <div className="mr-64 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
              <p className="text-muted-foreground">Manage your profile and preferences</p>
            </div>
            <Button variant="destructive" onClick={logout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </header>

          {/* Personal Info */}
          <Card className="p-6 mb-6 bg-card/50 backdrop-blur-sm border-border card-shadow">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Personal Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" value={profile.first_name || ""} onChange={handleProfileChange} className="mt-2" />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" value={profile.last_name || ""} onChange={handleProfileChange} className="mt-2" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile.email || ""} disabled className="mt-2" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={profile.phone || ""} onChange={handleProfileChange} className="mt-2" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={profile.address || ""} onChange={handleProfileChange} className="mt-2" />
              </div>
            </div>
            <Button className="mt-6" onClick={saveProfile}>Save Changes</Button>
          </Card>

          {/* Solar Panel Info (one-time) */}
          <Card className="p-6 mb-6 bg-card/50 backdrop-blur-sm border-border card-shadow">
            <h3 className="text-xl font-bold mb-6">Solar Panel Information</h3>
            {panelLoaded ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">Total Capacity (kW)</Label>
                  <Input id="capacity" type="number" value={panel.capacity || ""} disabled className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="efficiency">Efficiency (%)</Label>
                  <Input id="efficiency" type="number" value={panel.efficiency || ""} disabled className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="install_date">Installation Date</Label>
                  <Input id="install_date" type="date" value={panel.install_date || ""} disabled className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input id="manufacturer" value={panel.manufacturer || ""} disabled className="mt-2" />
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">Total Capacity (kW)</Label>
                  <Input id="capacity" type="number" value={panelInputs.capacity} onChange={handlePanelChange} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="efficiency">Efficiency (%)</Label>
                  <Input id="efficiency" type="number" value={panelInputs.efficiency} onChange={handlePanelChange} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="install_date">Installation Date</Label>
                  <Input id="install_date" type="date" value={panelInputs.install_date} onChange={handlePanelChange} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input id="manufacturer" value={panelInputs.manufacturer} onChange={handlePanelChange} className="mt-2" />
                </div>
              </div>
            )}
            {!panelLoaded && <Button className="mt-6" onClick={savePanel}>Save Solar Panel</Button>}
          </Card>

          {/* Change Password */}
          <Card className="p-6 bg-card/50 border-border card-shadow">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" /> Change Password
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Input id="current" type="password" placeholder="Current Password" value={passwords.current} onChange={handlePasswordChange} className="mt-2" />
              <Input id="new" type="password" placeholder="New Password" value={passwords.new} onChange={handlePasswordChange} className="mt-2" />
              <Input id="confirm" type="password" placeholder="Confirm New Password" value={passwords.confirm} onChange={handlePasswordChange} className="mt-2" />
            </div>
            <Button className="mt-6" onClick={updatePassword}>Change Password</Button>
          </Card>
        </div>
      </div>
      <Sidebar />
    </div>
  );
};

export default Account;
