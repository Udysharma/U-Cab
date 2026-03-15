import { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export function BookingProvider({ children }) {
  const [currentBooking, setCurrentBooking] = useState(null);
  const [pickup, setPickup] = useState({ address: '', lat: 28.6139, lng: 77.2090 });
  const [dropoff, setDropoff] = useState({ address: '', lat: 28.5355, lng: 77.3910 });
  const [selectedCabType, setSelectedCabType] = useState('Economy');
  const [fareEstimate, setFareEstimate] = useState(null);

  const resetBooking = () => {
    setCurrentBooking(null);
    setPickup({ address: '', lat: 28.6139, lng: 77.2090 });
    setDropoff({ address: '', lat: 28.5355, lng: 77.3910 });
    setSelectedCabType('Economy');
    setFareEstimate(null);
  };

  return (
    <BookingContext.Provider
      value={{
        currentBooking, setCurrentBooking,
        pickup, setPickup,
        dropoff, setDropoff,
        selectedCabType, setSelectedCabType,
        fareEstimate, setFareEstimate,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}
