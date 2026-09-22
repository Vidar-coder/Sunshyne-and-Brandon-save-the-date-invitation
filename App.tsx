import React, { useState, useEffect } from 'react';
import InvitationCard from './components/InvitationCard';
import LoadingList from './components/LoadingList';
import RSVPModal from './components/RSVPModal';
import GuestBookModal from './components/GuestBookModal';
import BackgroundMusic from './components/BackgroundMusic';
import Layout from './components/Layout';
import { InvitationDetails } from './types';
import {
  GUEST_SHEET_UPDATED_EVENT,
  pollGuestSheetAfterRsvp,
  refreshGuestSheet,
  type GuestSheetData,
} from './lib/guestSheet';

const details: InvitationDetails = {
  groom: "Brandon",
  bride: "Sunshyne",
  date: "August 14, 2027",
  location: "Davao City",
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [showRSVP, setShowRSVP] = useState(false);
  const [showGuestBook, setShowGuestBook] = useState(false);
  const [guestCount, setGuestCount] = useState<number | null>(null);

  useEffect(() => {
    void refreshGuestSheet().then((data) => setGuestCount(data.totalGuests)).catch((e) => {
      console.error('Failed to fetch guest count', e);
    });

    const onSheetUpdated = (event: Event) => {
      const data = (event as CustomEvent<GuestSheetData>).detail;
      if (data) setGuestCount(data.totalGuests);
    };

    const onRsvpUpdated = () => {
      void pollGuestSheetAfterRsvp();
    };

    window.addEventListener(GUEST_SHEET_UPDATED_EVENT, onSheetUpdated);
    window.addEventListener('rsvpUpdated', onRsvpUpdated);
    return () => {
      window.removeEventListener(GUEST_SHEET_UPDATED_EVENT, onSheetUpdated);
      window.removeEventListener('rsvpUpdated', onRsvpUpdated);
    };
  }, []);

  return (
    <Layout>
      {/* h-[100dvh] ensures it fits the dynamic viewport height on mobile browsers, eliminating scroll */}
      <div className="relative w-full h-[100dvh] bg-[#030712] overflow-hidden selection:bg-[#d4af37] selection:text-[#030712] flex flex-col items-center justify-center">
      {loading ? (
        <LoadingList onComplete={() => setLoading(false)} />
      ) : (
        <>
          <main className="relative z-10 h-full max-h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center">
               <InvitationCard 
                 details={details} 
                 onRSVP={() => setShowRSVP(true)} 
                 guestCount={guestCount}
                 onViewGuestBook={() => setShowGuestBook(true)}
               />
          </main>

          {/* Modals Layer */}
          <RSVPModal isOpen={showRSVP} onClose={() => setShowRSVP(false)} />
          <GuestBookModal isOpen={showGuestBook} onClose={() => setShowGuestBook(false)} />
          
          {/* Background Music */}
          <BackgroundMusic />
        </>
      )}
      </div>
    </Layout>
  );
};

export default App;