import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';

export function LandingPage() {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <HeroSection />
    </div>
  );
}
