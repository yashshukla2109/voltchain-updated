import React, { useContext } from "react";
import { TransactionsProvider, TransactionContext } from "@/context/TransactionContext";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";

// Define context type
interface TransactionContextProps {
  currentAccount: string;
  connectWallet: () => Promise<void>;
  formData: {
    addressTo: string;
    amount: string;
    keyword: string;
    message: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  sendTransaction: () => Promise<void>;
  isLoading: boolean;
  balance: string;
  transactions: any[];
}

const Wallet: React.FC = () => {
  return (
    <TransactionsProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-start justify-center p-6 gap-10 md:gap-20">
          <WalletContent />
        </div>
      </div>
    </TransactionsProvider>
  );
};

// Navbar
const Navbar: React.FC = () => {
  const links = ["Market", "Exchange", "Tutorial", "Wallet", "Login"];
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-md">
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-zap h-8 w-8 text-primary" data-lov-id="src\components\Sidebar.tsx:45:10" data-lov-name="Zap" data-component-path="src\components\Sidebar.tsx" data-component-line="45" data-component-file="Sidebar.tsx" data-component-name="Zap" data-component-content="%7B%22className%22%3A%22h-8%20w-8%20text-primary%20animate-pulse-glow%22%7D"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg>
        <h1 data-lov-id="src\components\Sidebar.tsx:46:10" data-lov-name="h1" data-component-path="src\components\Sidebar.tsx" data-component-line="46" data-component-file="Sidebar.tsx" data-component-name="h1" data-component-content="%7B%22text%22%3A%22VoltChain%22%2C%22className%22%3A%22text-4xl%20font-bold%20bg-gradient-to-r%20from-cyan-400%20via-blue-500%20to-purple-500%20bg-clip-text%20text-transparent%22%7D" className="text-4xl font-bold">VoltChain</h1>
      </div>
      <div className="hidden md:flex gap-6">
        {links.map((link, idx) => (
          <a key={idx} href="#" className="text-white font-medium hover:text-[#00f6ff] transition-colors">{link}</a>
        ))}
      </div>
    </div>
  );
};

// Wallet Content
const WalletContent: React.FC = () => {
  const {
    currentAccount,
    connectWallet,
    formData,
    handleChange,
    sendTransaction,
    isLoading,
    balance,
    transactions
  } = useContext(TransactionContext) as TransactionContextProps;

  const features = ["Reliability", "Security", "Ethereum", "Web 3.0", "Low Fees", "Blockchain"];

  const addHardhatNetwork = async () => {
    try {
      if (!(window as any).ethereum) return alert("MetaMask is not installed!");
      await (window as any).ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x7A69", // 31337 Hex
            chainName: "Hardhat Local",
            rpcUrls: ["http://127.0.0.1:8545/"],
            nativeCurrency: {
              name: "Ethereum",
              symbol: "ETH",
              decimals: 18,
            },
          },
        ],
      });
      alert("Hardhat Network configured successfully!");
    } catch (err: any) {
      console.error(err);
      alert("Failed to add network: " + err.message);
    }
  };

  return (
    <>
      {/* Left Column */}
      <div className="flex flex-col gap-6 w-full md:w-1/2">
        {!currentAccount && (
          <button
            onClick={connectWallet}
            className="flex items-center gap-3 px-6 py-3 bg-blue-600 rounded-full hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-1 text-white font-semibold"
          >
            <AiFillPlayCircle className="text-2xl" />
            Connect Wallet
          </button>
        )}

        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex flex-col gap-3">
          <h2 className="text-white font-semibold text-lg mb-2">Wallet Info</h2>
          <p className="text-white text-sm">Account: {currentAccount ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}` : "Not connected"}</p>
          <p className="text-white text-sm">ETH Balance: {balance}</p>
          <p className="text-white text-sm">Transactions: {transactions?.length || 0}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex flex-col gap-2">
          <h2 className="text-white font-semibold text-lg">How to Use</h2>
          <ol className="text-white text-sm list-decimal list-inside mb-2">
            <li>Connect your MetaMask wallet</li>
            <li>Configure Hardhat properly</li>
            <li>Fill in address and amount</li>
            <li>Click Send Now</li>
          </ol>
          <button
            onClick={addHardhatNetwork}
            className="w-full py-2 bg-purple-600/60 hover:bg-purple-600 rounded-xl text-white font-medium text-sm transition-all border border-purple-400/50 shadow-md"
          >
            + Add Hardhat Local Network
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
          {features.map((item, idx) => (
            <div key={idx} className="flex justify-center items-center min-h-[70px] border border-gray-400 text-white font-light rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-6 w-full md:w-1/2">
        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
          <div className="flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-full border-2 border-white flex justify-center items-center">
                <SiEthereum fontSize={24} color="#fff" />
              </div>
              <BsInfoCircle fontSize={18} color="#fff" />
            </div>
            <div className="mt-4">
              <p className="text-white font-light text-sm">
                {currentAccount ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}` : "Not connected"}
              </p>
              <p className="text-white font-semibold text-lg mt-1">Ethereum</p>
            </div>
          </div>
        </div>

        {currentAccount && (
          <div className="p-6 rounded-2xl bg-blue-700/20 backdrop-blur-md border border-blue-400/30 shadow-lg flex flex-col gap-3">
            <input
              placeholder="Address To"
              value={formData.addressTo}
              onChange={(e) => handleChange(e, "addressTo")}
              className="my-2 w-full rounded-xl p-3 outline-none bg-white/10 backdrop-blur-md text-white placeholder-gray-300 border border-white/20 text-sm transition-all hover:border-white/40"
            />
            <input
              placeholder="Amount (ETH)"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange(e, "amount")}
              className="my-2 w-full rounded-xl p-3 outline-none bg-white/10 backdrop-blur-md text-white placeholder-gray-300 border border-white/20 text-sm transition-all hover:border-white/40"
            />
            <input
              placeholder="Keyword (Gif)"
              value={formData.keyword}
              onChange={(e) => handleChange(e, "keyword")}
              className="my-2 w-full rounded-xl p-3 outline-none bg-white/10 backdrop-blur-md text-white placeholder-gray-300 border border-white/20 text-sm transition-all hover:border-white/40"
            />
            <input
              placeholder="Message"
              value={formData.message}
              onChange={(e) => handleChange(e, "message")}
              className="my-2 w-full rounded-xl p-3 outline-none bg-white/10 backdrop-blur-md text-white placeholder-gray-300 border border-white/20 text-sm transition-all hover:border-white/40"
            />

            <button
              onClick={sendTransaction}
              className="w-full py-3 from-[#00f6ff] to-[#ff00d0] rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 mt-2"
            >
              {isLoading ? "Sending..." : "Send Now"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Wallet;
