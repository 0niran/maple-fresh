import Navigation from '@/components/layout/Navigation';
import Hero from '@/components/Hero';
import ComboServices from '@/components/ComboServices';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navigation variant="public" />
      <Hero />
      <ComboServices />
      <Footer />
    </>
  );
}