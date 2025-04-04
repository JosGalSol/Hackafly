import Amadeus from 'amadeus';
import dotenv from 'dotenv';

dotenv.config();

const { AMADEUS_API_KEY, AMADEUS_API_SECRET } = process.env;

const amadeus = new Amadeus({
    clientId: AMADEUS_API_KEY,
    clientSecret: AMADEUS_API_SECRET,
});

export default amadeus;
