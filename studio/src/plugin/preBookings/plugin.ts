import { definePlugin } from 'sanity';
import PreBookingsTool from './components/PreBookingsTool';

const preBookingsTool = () => {
  return {
    title: 'Pre-Bookings',
    name: 'preBookings',
    component: () => (
      PreBookingsTool()
    ),
  }
}

export const preBookingsPlugin = definePlugin({
  name: 'preBookingsPlugin',
  tools: [ 
    preBookingsTool() 
  ],
});
