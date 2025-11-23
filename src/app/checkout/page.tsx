import { CheckoutView } from '@/components/sections/checkout-view';
import Header from '@/components/sections/header';
import BackgroundLayer from '@/components/sections/background-layer';

export default function CheckoutPage() {
  return (
    <>
      <BackgroundLayer />
      <main className="relative min-h-screen">
        <CheckoutView />
      </main>
      <Header showWhatsApp={true} />
    </>
  );
}