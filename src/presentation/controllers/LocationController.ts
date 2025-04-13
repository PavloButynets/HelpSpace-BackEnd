import {inject, injectable} from "inversify";
import {LocationService} from "../../application/services/LocationService";
import {LOCATION_TYPES} from "../../container/types/LocationTypes";
import {Request, Response} from 'express';
@injectable()
export class LocationController{
    constructor(@inject(LOCATION_TYPES.LocationService) private locationService: LocationService) {
    }

    async getCities(req: Request, res: Response) {
        try {
            const countryCode = req.query.countryCode as string;
            const query = req.query.query as string;

            const cities = await this.locationService.getCities(query, countryCode);
            res.status(200).json(cities);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
}