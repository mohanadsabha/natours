import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
    'pk_test_51RBdcBQgVqt3Pq0Dq3Z8lIeDgd7EhrW7W5jamYoxwHsaZ3t3Xu0ynvfTLlRzbbqQtA07BoaVtfKlgjlXWwgw3Zz000zEzOeb7c',
);

export const bookTour = async (tourId) => {
    try {
        // 1) Get checkout session from API
        const session = await axios(
            `/api/v1/bookings/checkout-session/${tourId}`,
        );

        // 2) Create checkout form + chanre credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};
