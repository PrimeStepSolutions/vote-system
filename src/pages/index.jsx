import HeroSection from "../components/HeroSection";
import SecurityBadge from "../components/SecurityBadge";
import VotingPhasesTimeline from "../components/VotingPhasesTimeline";
import SupportSection from "../components/SupportSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <SecurityBadge />
      <VotingPhasesTimeline />
      <SupportSection />
    </main>
  );
}
