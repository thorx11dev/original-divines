import { OrderHistoryView } from '@/components/sections/order-history-view';
import Header from '@/components/sections/header';
import BackgroundLayer from '@/components/sections/background-layer';

export default function OrderHistoryPage() {
  return (
    <>
      <BackgroundLayer />
      <main className="relative min-h-screen">
        <OrderHistoryView />
      </main>
      <Header />
    </>
  );
}
