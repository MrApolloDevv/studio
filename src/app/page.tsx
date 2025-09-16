import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Smartphone, Cog, Github, Linkedin } from 'lucide-react';
import Image from 'next/image';

// Inline SVGs for tech logos for simplicity
const NextJsLogo = () => (
  <svg width="40" height="40" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="64" cy="64" r="64" fill="black"/>
    <path d="M102.5 38.25H83.25L50.25 88.5H69.5L102.5 38.25Z" fill="white"/>
    <path d="M80.125 38.25H65.875L32.875 88.5H47.125L80.125 38.25Z" fill="url(#paint0_linear_1_2)"/>
    <rect x="106" y="38" width="8" height="51" fill="white"/>
    <defs>
      <linearGradient id="paint0_linear_1_2" x1="56.5" y1="38.25" x2="56.5" y2="88.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" stopOpacity="0"/>
        <stop offset="1" stopColor="white"/>
      </linearGradient>
    </defs>
  </svg>
);

const ReactLogo = () => (
    <svg width="40" height="40" viewBox="-11.5 -10.23174 23 20.46348" xmlns="http://www.w3.org/2000/svg">
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2"/>
            <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
            <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
        </g>
    </svg>
);

const TailwindLogo = () => (
    <svg width="40" height="40" viewBox="0 0 256 154" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M128 0C93.8667 0 72.5333 21.3333 64 32C55.4667 21.3333 34.1333 0 0 0C17.0667 17.0667 21.3333 42.6667 21.3333 64C21.3333 85.3333 17.0667 106.667 0 128C34.1333 128 55.4667 106.667 64 96C72.5333 106.667 93.8667 128 128 128C110.933 110.933 106.667 85.3333 106.667 64C106.667 42.6667 110.933 17.0667 128 0Z" fill="#38BDF8"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M256 0C221.867 0 200.533 21.3333 192 32C183.467 21.3333 162.133 0 128 0C145.067 17.0667 149.333 42.6667 149.333 64C149.333 85.3333 145.067 106.667 128 128C162.133 128 183.467 106.667 192 96C200.533 106.667 221.867 128 256 128C238.933 110.933 234.667 85.3333 234.667 64C234.667 42.6667 238.933 17.0667 256 0Z" fill="#38BDF8"/>
    </svg>
);

const FirebaseLogo = () => (
    <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.81232 54.3421L38.4239 9.38718L32.0315 2.99478L9.81232 54.3421Z" fill="#FFC24A"/>
        <path d="M38.4284 9.38501L32.036 2.99262L25.6565 9.37213L32.036 31.579L38.4284 9.38501Z" fill="#F4BD42"/>
        <path d="M9.81232 54.3421L24.1165 40.0379L9.81232 54.3421Z" fill="#FFA000"/>
        <path d="M31.9999 31.579L24.1209 40.0335L31.9999 46.4259L38.4114 9.38501L31.9999 31.579Z" fill="#F6820C"/>
        <path d="M9.81232 54.3421L32.0191 46.4259L24.1165 40.0379L9.81232 54.3421Z" fill="#FFC928"/>
    </svg>
);

const GenkitLogo = () => (
  <svg width="40" height="40" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M960.384 320V128H768V320L512.384 488.016L256.384 320V128H64.3842V320L0.384155 512L64.3842 704V896H256.384V704L512.384 535.984L768.384 704V896H960.384V704L1024.38 512L960.384 320Z" fill="#4285F4"/>
    <path d="M512.384 536.016L256.384 704V896H448.384V704L512.384 648L576.384 704V896H768.384V704L512.384 536.016Z" fill="#1967D2"/>
  </svg>
);


export default function HomePage() {
  const features = [
    {
      icon: <BrainCircuit className="w-8 h-8 text-accent" />,
      title: 'IA Poderosa',
      description: 'Jogue contra o motor de xadrez Stockfish, um dos mais fortes do mundo.',
    },
    {
      icon: <Smartphone className="w-8 h-8 text-accent" />,
      title: 'Totalmente Responsivo',
      description: 'Uma experiência de jogo fluida em qualquer dispositivo, do desktop ao celular.',
    },
    {
      icon: <Cog className="w-8 h-8 text-accent" />,
      title: 'Tecnologia de Ponta',
      description: 'Construído com Next.js, Genkit e Firebase para performance e confiabilidade.',
    },
  ];

  const technologies = [
    { name: 'Next.js', logo: <NextJsLogo /> },
    { name: 'React', logo: <ReactLogo /> },
    { name: 'Tailwind CSS', logo: <TailwindLogo /> },
    { name: 'Genkit', logo: <GenkitLogo/> },
    { name: 'Firebase', logo: <FirebaseLogo /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative text-center py-20 md:py-32 bg-black">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{backgroundImage: "url('https://images.unsplash.com/photo-1580541832626-2a7135ee42c4?q=80&w=2070&auto=format&fit=crop')"}}
            data-ai-hint="chess board dark"
          ></div>
           <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-background"></div>

          <div className="relative container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Arena de Xadrez
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
              Sua plataforma de xadrez online para partidas desafiadoras contra a IA Stockfish.
            </p>
            <Link href="/game" passHref>
              <Button size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
                Começar a Jogar
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Recursos em Destaque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-card border-border/50 text-center flex flex-col items-center">
                  <CardHeader>
                    {feature.icon}
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <CardTitle className="mb-2 text-xl">{feature.title}</CardTitle>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="stack" className="py-16 md:py-24 bg-card/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              A Tecnologia por Trás do Jogo
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {technologies.map((tech) => (
                <div key={tech.name} className="flex flex-col items-center gap-2 text-center transition-transform hover:scale-110">
                  {tech.logo}
                  <span className="text-sm font-medium text-muted-foreground">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 bg-card">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Arena de Xadrez. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
