import { TeamPortalNav } from '@/components/team-portal/team-portal-nav';
import BackgroundLayer from '@/components/sections/background-layer';

export default function TeamPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BackgroundLayer />
      <div className="min-h-screen relative">
        <TeamPortalNav />
        <main className="pt-[120px] pb-[60px] px-[20px] md:px-[40px]">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}