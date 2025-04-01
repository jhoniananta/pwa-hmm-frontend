import HeroSection from './hero';
import TujuanBeasiswaSection from './tujuan-section';
import VisiMisiSection from './visi-misi-section';
import ManfaatSection from './manfaat-section';
import LastBanner from './last-banner';
import RelasiSection from './relasi-section';

export default function BeasiswaInternalPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-8 md:gap-10">
      <HeroSection />
      <RelasiSection />
      <TujuanBeasiswaSection />
      <VisiMisiSection />
      <ManfaatSection />
      <LastBanner />
    </div>
  );
}
