import React, { useState, useEffect, useRef } from 'react';
import { Heart, CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const RSVPModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Handle animation timing for unmounting
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const guests = formData.get("guests") as string;
    const message = formData.get("message") as string;

    // Google Forms integration
    const googleFormData = new FormData();
    googleFormData.append("entry.405401269", name);
    googleFormData.append("entry.1755234596", email);
    googleFormData.append("entry.1335956832", guests);
    googleFormData.append("entry.893740636", message);

    try {
      await fetch(
        "https://docs.google.com/forms/d/e/1FAIpQLSdRVLG6JthQKdFEMtC3RRRwS6Q-4zR2Vqz2XgGl6ixcjEgZGw/formResponse",
        {
          method: "POST",
          mode: "no-cors",
          body: googleFormData,
        }
      );

      formRef.current?.reset();
      // Dispatch event for GuestBook to update
      window.dispatchEvent(new Event("rsvpUpdated"));

      setIsSubmitting(false);
      setStep('success');
    } catch (error) {
      setIsSubmitting(false);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state after animation finishes
    setTimeout(() => {
      setStep('form');
      setError(null);
    }, 300);
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#030712]/75 backdrop-blur-md" 
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className={`relative w-full max-w-md overflow-hidden rounded-lg border border-[#d4af37]/35 bg-gradient-to-b from-[#0c1424] via-[#070d18] to-[#030712] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.65),0_0_40px_rgba(212,175,55,0.12)] sm:p-6 md:p-10 transform transition-all duration-500 ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'}`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(212,175,55,0.08),transparent_55%)]" aria-hidden />

        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 rounded-sm p-1 text-[#fff8dc]/65 transition-colors hover:text-[#d4af37] sm:top-4 sm:right-4"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {step === 'form' ? (
          <div className="animate-fade-in-up" style={{ animationDuration: '0.5s' }}>
            <div className="relative mb-4 text-center sm:mb-6 md:mb-8">
              <h2 className="mb-1 font-serif text-xl text-[#fffef8] sm:mb-2 sm:text-2xl md:text-3xl lg:text-4xl [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">You&apos;re Invited!</h2>
              <p className="font-body text-sm italic text-[#f5e6a8]/90 sm:text-base md:text-lg">We would be honored to celebrate with you.</p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="relative space-y-3 sm:space-y-4 md:space-y-5">
              <div className="group">
                <label className="mb-0.5 block font-serif text-[10px] uppercase tracking-[0.22em] text-[#fff8dc]/75 transition-colors group-focus-within:text-[#d4af37] sm:mb-1 sm:text-xs">Full Name *</label>
                <input 
                  required
                  name="name"
                  type="text" 
                  placeholder="Enter your full name"
                  className="w-full border-b border-[#d4af37]/25 bg-[#030712]/35 px-1 py-1.5 font-body text-sm text-[#fffef8] placeholder:text-[#fff8dc]/35 focus:border-[#d4af37] focus:bg-[#030712]/55 focus:outline-none sm:py-2 sm:text-base md:text-lg"
                />
              </div>

              <div className="group">
                <label className="mb-0.5 block font-serif text-[10px] uppercase tracking-[0.22em] text-[#fff8dc]/75 transition-colors group-focus-within:text-[#d4af37] sm:mb-1 sm:text-xs">Email Address *</label>
                <input 
                  required
                  name="email"
                  type="email" 
                  placeholder="Enter your email address"
                  className="w-full border-b border-[#d4af37]/25 bg-[#030712]/35 px-1 py-1.5 font-body text-sm text-[#fffef8] placeholder:text-[#fff8dc]/35 focus:border-[#d4af37] focus:bg-[#030712]/55 focus:outline-none sm:py-2 sm:text-base md:text-lg"
                />
              </div>

               <div className="group">
                <label className="mb-0.5 block font-serif text-[10px] uppercase tracking-[0.22em] text-[#fff8dc]/75 transition-colors group-focus-within:text-[#d4af37] sm:mb-1 sm:text-xs">Number of Guests *</label>
                <div className="relative">
                  <select 
                    required
                    name="guests"
                    className="w-full cursor-pointer appearance-none border-b border-[#d4af37]/25 bg-[#030712]/35 px-1 py-1.5 font-body text-sm text-[#fffef8] focus:border-[#d4af37] focus:bg-[#030712]/55 focus:outline-none sm:py-2 sm:text-base md:text-lg"
                  >
                    {[1, 2, 3].map(n => <option key={n} value={n} className="bg-[#0c1424]">{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                  </select>
                  <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#fff8dc]/50">
                     <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="mb-0.5 block font-serif text-[10px] uppercase tracking-[0.22em] text-[#fff8dc]/75 transition-colors group-focus-within:text-[#d4af37] sm:mb-1 sm:text-xs">Message (Optional)</label>
                <textarea 
                  name="message"
                  placeholder="Share your excitement"
                  rows={2}
                  className="w-full resize-none border-b border-[#d4af37]/25 bg-[#030712]/35 px-1 py-1.5 font-body text-sm text-[#fffef8] placeholder:text-[#fff8dc]/35 focus:border-[#d4af37] focus:bg-[#030712]/55 focus:outline-none sm:py-2 sm:text-base md:text-lg"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-sm border border-red-400/30 bg-red-950/40 p-2 text-red-300 sm:p-3">
                  <AlertCircle size={14} className="sm:w-4 sm:h-4" />
                  <span className="font-body text-xs sm:text-sm">{error}</span>
                </div>
              )}

              <div className="pt-2 sm:pt-3 md:pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-1.5 rounded-sm bg-gradient-to-br from-[#d4af37] via-[#c9a227] to-[#8b6914] py-2.5 font-serif text-xs uppercase tracking-[0.26em] text-[#1a1408] shadow-lg shadow-[#d4af37]/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#d4af37]/35 disabled:cursor-not-allowed disabled:opacity-70 sm:gap-2 sm:py-3 sm:text-sm md:py-4 md:tracking-[0.3em]"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                      Submit RSVP
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="relative flex animate-fade-in-up flex-col items-center py-6 text-center sm:py-8 md:py-10">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#d4af37]/35 bg-[#d4af37]/10 text-[#fff8dc] sm:mb-5 sm:h-16 sm:w-16 md:mb-6 md:h-20 md:w-20">
               <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10" />
            </div>
            <h3 className="mb-3 font-serif text-xl text-[#fffef8] sm:mb-4 sm:text-2xl md:mb-6 md:text-3xl">RSVP Sent!</h3>
            <div className="mx-auto max-w-xs space-y-1.5 font-body text-sm leading-relaxed text-[#f5e6a8]/90 sm:space-y-2 sm:text-base md:text-lg">
              <p>
                Your attendance will be reported and be reflected to our guestbook.
              </p>
              <p className="pt-1 sm:pt-2">
                We are excited to see you.<br/>Thanks for confirming.
              </p>
            </div>
            <button 
              onClick={handleClose}
              className="mt-6 border-b border-transparent font-serif text-[10px] uppercase tracking-[0.28em] text-[#d4af37] transition-all hover:border-[#d4af37] sm:mt-8 sm:text-xs md:mt-10"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default RSVPModal;