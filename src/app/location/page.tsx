import { LocationView } from '@/components/sections/location-view';
import Header from '@/components/sections/header';
import BackgroundLayer from '@/components/sections/background-layer';

export default function LocationPage() {
  return (
    <>
      <BackgroundLayer />
      <main className="relative min-h-screen">
        <LocationView />
      </main>
      <Header showWhatsApp={true} />
    </>
  );
}