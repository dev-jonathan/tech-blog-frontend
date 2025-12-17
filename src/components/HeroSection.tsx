import { Link } from 'react-router-dom';
import { Button } from './ui/button';

export function HeroSection() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 py-5 md:px-40">
      <div className="flex h-full flex-col items-center justify-center py-5">
        <div className="flex flex-col items-center gap-4 px-4 pt-5 pb-2">
          <h1 className="text-foreground text-center text-5xl leading-none font-semibold md:text-8xl">
            Insights &<br className="md:hidden" /> Learning
          </h1>

          <p className="text-foreground text-center text-base leading-none font-normal md:text-3xl">
            Explorando tendências Tech, um post por vez
          </p>

          <Button
            className="bg-primary text-primary-foreground h-10 rounded-xl px-4 text-sm font-semibold hover:opacity-90"
            asChild
          >
            <Link to="/login">Começar a ler</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
