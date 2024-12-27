export class RestaurantBookingSDK {
  constructor(private apiKey: string, private baseUrl: string) {}

  async createBooking(booking: {
    date: string;
    time: string;
    guests: number;
    customerName: string;
  }) {
    const response = await fetch(`${this.baseUrl}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey
      },
      body: JSON.stringify(booking)
    });
    
    return response.json();
  }

  async checkAvailability(date: string, time: string, guests: number) {
    const response = await fetch(
      `${this.baseUrl}/api/availability?date=${date}&time=${time}&guests=${guests}`,
      {
        headers: {
          'X-API-Key': this.apiKey
        }
      }
    );
    
    return response.json();
  }
}