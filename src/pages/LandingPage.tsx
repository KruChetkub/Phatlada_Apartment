import React, { useState } from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingHero } from '../components/landing/LandingHero';
import { LandingRooms } from '../components/landing/LandingRooms';
import { LandingFacilities } from '../components/landing/LandingFacilities';
import { LandingContact } from '../components/landing/LandingContact';
import { LandingFooter } from '../components/landing/LandingFooter';
import { BookingInquiryModal } from '../components/landing/BookingInquiryModal';

export const LandingPage: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState('');

  const handleOpenBooking = (roomType = '') => {
    setSelectedRoomType(roomType);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* Public Navigation */}
      <LandingNavbar onOpenBooking={() => handleOpenBooking()} />

      {/* Main Sections */}
      <main className="flex-1">
        <LandingHero onOpenBooking={() => handleOpenBooking()} />
        <LandingRooms onSelectRoom={(type) => handleOpenBooking(type)} />
        <LandingFacilities />
        <LandingContact onOpenBooking={() => handleOpenBooking()} />
      </main>

      {/* Footer */}
      <LandingFooter />

      {/* Appointment / Booking Modal */}
      <BookingInquiryModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        defaultRoomType={selectedRoomType}
      />
    </div>
  );
};

