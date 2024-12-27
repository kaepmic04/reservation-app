import React from 'react';

interface BookingWidgetProps {
  restaurantId: string;
  apiKey: string;
}

export function BookingWidget({ restaurantId, apiKey }: BookingWidgetProps) {
  const widgetUrl = `${window.location.origin}/booking-widget?rid=${restaurantId}&key=${apiKey}`;
  
  return (
    <iframe 
      src={widgetUrl}
      width="100%"
      height="600px"
      frameBorder="0"
      allow="payment"
    />
  );
}