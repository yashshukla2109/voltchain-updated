import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gavel, Timer, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Bidding = () => {
  const { toast } = useToast();
  const [bidAmount, setBidAmount] = useState("");
  const [userWallet, setUserWallet] = useState("");
  const [newAuction, setNewAuction] = useState({
    seller: "",
    amount: "",
    currentBid: "",
    timeLeft: "",
  });

  const [auctions, setAuctions] = useState([
    { 
      id: 1, 
      seller: "MegaSolar Inc", 
      amount: 50.0, 
      currentBid: 78.5, 
      timeLeft: "2h 15m", 
      bids: 12,
      bidsList: [
        { amount: 78.5, wallet: "0xC13F2710e1e877Cb29b5ffc1BcA890E07aCD4Df7" },
        { amount: 77.0, wallet: "0x4086159275d75cDc162eb2B060c425323EFA83fB" },
      ]
    },
    { 
      id: 2, 
      seller: "CleanEnergy Pro", 
      amount: 35.2, 
      currentBid: 54.2, 
      timeLeft: "45m", 
      bids: 8,
      bidsList: [
        { amount: 54.2, wallet: "0xc2F14Ef4f10ADFA8Fe49A60AFcB0a91678D95C4f" }
      ]
    },
    { 
      id: 3, 
      seller: "SolarMax Corp", 
      amount: 28.5, 
      currentBid: 43.8, 
      timeLeft: "1h 30m", 
      bids: 15,
      bidsList: [
        { amount: 43.8, wallet: "0xbB2D341c4f6F42e34c848cD1e2fA2cDcc1DdDD30" }
      ]
    },
  ]);

  const handleBid = (auction: typeof auctions[0]) => {
    if (!bidAmount || Number(bidAmount) <= auction.currentBid) {
      toast({
        variant: "destructive",
        title: "Invalid Bid",
        description: "Your bid must be higher than the current bid.",
      });
      return;
    }

    if (!userWallet) {
      toast({
        variant: "destructive",
        title: "Wallet Address Required",
        description: "Please enter your wallet address to place a bid.",
      });
      return;
    }

    setAuctions((prev) =>
      prev.map((a) =>
        a.id === auction.id
          ? { 
              ...a, 
              currentBid: Number(bidAmount), 
              bids: a.bids + 1,
              bidsList: [...a.bidsList, { amount: Number(bidAmount), wallet: userWallet }]
            }
          : a
      )
    );

    toast({
      title: "Bid placed successfully",
      description: `Bid $${bidAmount} on ${auction.amount} kWh from ${auction.seller} with wallet ${userWallet}`,
    });

    setBidAmount("");
    setUserWallet("");
  };

  const handleAddAuction = () => {
    const { seller, amount, currentBid, timeLeft } = newAuction;
    if (!seller || !amount || !currentBid || !timeLeft) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill all auction details before adding.",
      });
      return;
    }

    const newEntry = {
      id: Date.now(),
      seller,
      amount: parseFloat(amount),
      currentBid: parseFloat(currentBid),
      timeLeft,
      bids: 0,
      bidsList: [],
    };

    setAuctions((prev) => [...prev, newEntry]);
    setNewAuction({ seller: "", amount: "", currentBid: "", timeLeft: "" });
    toast({
      title: "Auction added",
      description: `${seller} added to the auction list.`,
    });
  };

  const handleDelete = (id: number) => {
    setAuctions((prev) => prev.filter((a) => a.id !== id));
    toast({
      title: "Auction deleted",
      description: "The auction has been removed successfully.",
    });
  };

  return (
    <div className="min-h-screen gradient-cosmic">
      <div className="mr-64 p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2">Energy Auctions</h1>
            <p className="text-muted-foreground">Bid, add, or remove energy listings.</p>
          </header>

          {/* Add New Auction Form */}
          <Card className="p-6 mb-10 bg-card/50 backdrop-blur-sm border-border card-shadow">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Plus className="h-6 w-6 text-primary" /> Add New Auction
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label>Seller</Label>
                <Input
                  value={newAuction.seller}
                  onChange={(e) => setNewAuction({ ...newAuction, seller: e.target.value })}
                  placeholder="Company name"
                />
              </div>
              <div>
                <Label>Energy (kWh)</Label>
                <Input
                  type="number"
                  value={newAuction.amount}
                  onChange={(e) => setNewAuction({ ...newAuction, amount: e.target.value })}
                  placeholder="e.g. 40"
                />
              </div>
              <div>
                <Label>Starting Bid ($)</Label>
                <Input
                  type="number"
                  value={newAuction.currentBid}
                  onChange={(e) => setNewAuction({ ...newAuction, currentBid: e.target.value })}
                  placeholder="e.g. 50"
                />
              </div>
              <div>
                <Label>Time Left</Label>
                <Input
                  value={newAuction.timeLeft}
                  onChange={(e) => setNewAuction({ ...newAuction, timeLeft: e.target.value })}
                  placeholder="e.g. 2h 30m"
                />
              </div>
            </div>
            <Button onClick={handleAddAuction} className="mt-4">
              Add Auction
            </Button>
          </Card>

          {/* Auctions List */}
          <div className="space-y-6">
            {auctions.map((auction, idx) => (
              <Card
                key={auction.id}
                className="p-6 bg-card/50 backdrop-blur-sm border-border card-shadow animate-slide-up hover:scale-[1.02] transition-transform duration-300"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                      <Gavel className="h-6 w-6 text-primary" />
                      {auction.seller}
                    </h3>
                    <p className="text-muted-foreground">
                      {auction.amount} kWh available • {auction.bids} bids
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 text-accent">
                      <Timer className="h-5 w-5" />
                      <span className="font-bold">{auction.timeLeft}</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(auction.id)}
                      className="mt-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Current Highest Bid</p>
                    <p className="text-3xl font-bold text-primary">${auction.currentBid}</p>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor={`wallet-${auction.id}`}>Your Wallet</Label>
                      <Input
                        id={`wallet-${auction.id}`}
                        type="text"
                        placeholder="0xYourWalletAddress"
                        value={userWallet}
                        onChange={(e) => setUserWallet(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`bid-${auction.id}`}>Your Bid ($)</Label>
                      <Input
                        id={`bid-${auction.id}`}
                        type="number"
                        step="0.01"
                        placeholder={`>${auction.currentBid}`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <Button onClick={() => handleBid(auction)} className="mb-0.5">
                      Place Bid
                    </Button>
                  </div>
                </div>

                {/* Bid History */}
                <div className="mt-4">
                  <p className="font-semibold text-sm mb-2">Bid History:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {auction.bidsList.map((b, i) => (
                      <li key={i}>
                        ${b.amount} by <span className="font-mono">{b.wallet}</span>
                      </li>
                    ))}
                  </ul>
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

export default Bidding;
