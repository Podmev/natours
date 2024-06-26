import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_live_51PATMEKbjgMq6mlnFIiMtsDbgQ3GtZgo5HMFdpRmIPLg7WSHouQ4959L37aSwhOOi9d9UV3rMEiw1mvrLLNZktFN00JgOcUNAo',
  );
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`,
    );
    // console.log(session);
    // 2) Create checkout form + charge credit card

    // await stripe.redirectToCheckout({
    //     sessionId: session.data.session.id
    // });

    window.location.replace(session.data.session.url);
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
