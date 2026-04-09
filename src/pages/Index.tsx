import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight, Shield, TrendingUp, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen gradient-cosmic">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-2">
            <Zap className="h-10 w-10 text-primary animate-pulse-glow" />
           <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
  VoltChain
</h1>

          </div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </header>

        <main className="max-w-6xl mx-auto">
          <section className="text-center mb-20 animate-fade-in">
            <h2 className="text-6xl font-bold mb-6 leading-tight">
              The Future of
              <br />   
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent font-semibold">
  Energy Trading
</span>



            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Trade excess solar energy on the blockchain. Transparent, secure, and
              decentralized energy marketplace for a sustainable future.
            </p>
            <Link to="/signup">
              <Button size="lg" className="gap-2 glow-primary text-lg px-8 py-6">
                Start Trading <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </section>

          <section className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Shield,
                title: "Secure Trading",
                description: "Blockchain-verified transactions ensure transparency and security"
              },
              {
                icon: TrendingUp,
                title: "Real-Time Analytics",
                description: "Monitor market prices and optimize your energy trading"
              },
              {
                icon: Users,
                title: "Community Driven",
                description: "Connect with other solar energy producers and consumers"
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border card-shadow hover:scale-105 transition-transform duration-300 animate-slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </section>

          <section className="bg-card/30 backdrop-blur-sm rounded-3xl p-12 border border-border card-shadow text-center">
            <h3 className="text-4xl font-bold mb-6">Ready to revolutionize energy?</h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of solar panel owners trading energy on the blockchain
            </p>
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="gap-2 text-lg px-8 py-6">
                Create Account <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
