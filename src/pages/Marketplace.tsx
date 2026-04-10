import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, ShoppingCart, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Marketplace = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [listAmount, setListAmount] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [listWallet, setListWallet] = useState("");

  const [listings, setListings] = useState([
    {
      id: 1,
      seller: "SolarFarm A",
      amount: 15.5,
      price: 1.62,
      rating: 4.8,
      wallet: "0xC13F2710e1e877Cb29b5ffc1BcA890E07aCD4Df7",
    },
    {
      id: 2,
      seller: "EcoPanel Pro",
      amount: 8.2,
      price: 1.58,
      rating: 4.9,
      wallet: "0x4086159275d75cDc162eb2B060c425323EFA83fB",
    },
    {
      id: 3,
      seller: "GreenEnergy Co",
      amount: 22.1,
      price: 1.65,
      rating: 4.7,
      wallet: "0xc2F14Ef4f10ADFA8Fe49A60AFcB0a91678D95C4f",
    },
  ]);

  const isValidWallet = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr.trim());

  const handleList = () => {
    if (!listAmount || !listPrice || !listWallet) {
      toast({
        title: "Missing details",
        description: "Please enter amount, price, and wallet address.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidWallet(listWallet)) {
      toast({
        title: "Invalid wallet address",
        description: "Please enter a valid Ethereum-style address (0x...).",
        variant: "destructive",
      });
      return;
    }

    const newListing = {
      id: listings.length + 1,
      seller: "You",
      amount: parseFloat(listAmount),
      price: parseFloat(listPrice),
      rating: 5.0,
      wallet: listWallet.trim(),
    };

    setListings([newListing, ...listings]);

    toast({
      title: "Energy listed successfully",
      description: `${listAmount} kWh listed at $${listPrice}/kWh`,
    });

    setListAmount("");
    setListPrice("");
  };

  const handleBuy = (id: number) => {
    const selected = listings.find((l) => l.id === id);
    if (!selected) return;

    toast({
      title: "Redirecting to Wallet",
      description: `You are being redirected to complete your purchase for ${selected.amount} kWh.`,
    });

    // Redirect to wallet page
    navigate("/wallet");
  };

  const handleClearMyListings = () => {
    const userListings = listings.filter((l) => l.seller === "You");

    if (userListings.length === 0) {
      toast({
        title: "No listings to clear",
        description: "You have no active listings to remove.",
        variant: "destructive",
      });
      return;
    }

    setListings(listings.filter((l) => l.seller !== "You"));

    toast({
      title: "Cleared your listings",
      description: "All your listed units have been removed.",
    });
  };

  return (
    <div className="min-h-screen">
      <div className="mr-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8 text-center animate-fade-in">
            <h1 className="text-4xl font-bold mb-2">⚡ Energy Marketplace</h1>
            <p className="text-muted-foreground">
              Trade your excess electricity securely and instantly
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* List Energy Section */}
            <Card className="md:col-span-1 p-6 bg-card/50 backdrop-blur-sm border-border animate-slide-up">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                List Your Energy
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount (kWh)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={listAmount}
                    onChange={(e) => setListAmount(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price per kWh ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="Enter price"
                    value={listPrice}
                    onChange={(e) => setListPrice(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="wallet">Wallet Address</Label>
                  <Input
                    id="wallet"
                    type="text"
                    placeholder="Enter your wallet address (0x...)"
                    value={listWallet}
                    onChange={(e) => setListWallet(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Must be a valid Ethereum address.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button onClick={handleList} className="w-full">
                    List Energy
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleClearMyListings}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear My Listings
                  </Button>
                </div>
              </div>
            </Card>

            {/* Available Listings */}
            <Card className="md:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-border animate-slide-up">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Available Listings
              </h3>

              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                {listings.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No listings available
                  </p>
                ) : (
                  listings.map((listing) => (
                    <div
                      key={listing.id}
                      className="flex items-center justify-between p-4 bg-background/50 rounded-lg hover:bg-background/70 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-bold">{listing.seller}</p>
                        <p className="text-sm text-muted-foreground">
                          {listing.amount} kWh • Rating: {listing.rating}/5.0
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Wallet:{" "}
                          <span className="font-mono text-[12px]">
                            {listing.wallet}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            ${listing.price}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            per kWh
                          </p>
                        </div>
                        {listing.seller === "You" ? (
                          <Button disabled size="sm" variant="outline">
                            Your Listing
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => handleBuy(listing.id)}>
                            Buy
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Sidebar />
    </div>
  );
};

export default Marketplace;
