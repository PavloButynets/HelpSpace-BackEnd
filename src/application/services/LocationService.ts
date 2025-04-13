import axios from 'axios';
import {config} from "../../config/envConfig";

export class LocationService {
    private apiKey = config.GOOGLE_MAP_API_KEY
    async getCities(query: string, countryCode: string): Promise<string[]> {
        const sessionToken = Math.random().toString(36).substring(2);

        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=(cities)&components=country:${countryCode}&language=uk&key=${this.apiKey}&sessiontoken=${sessionToken}`;
        try {
            const response = await axios.get(url);

            if (response.data && response.data.predictions) {
                const cities = response.data.predictions
                    .map((prediction: any) => prediction.description)
                    .filter((name: string) => !!name);

                return cities;
            } else {
                throw new Error('No cities data found');
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
            return [];
        }
    }
}
