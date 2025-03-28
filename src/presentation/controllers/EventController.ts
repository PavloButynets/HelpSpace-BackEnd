import { Request, Response } from 'express';
import {inject, injectable} from "inversify";
import {EVENT_TYPES} from "../../container/types/EventTypes.";
import {plainToInstance} from 'class-transformer';
import {EventService} from "../../application/services/EventService";
import {CreateEventDTO} from "../../application/dto/request/CreateEventDTO";

@injectable()
export class EventController {
    constructor(@inject(EVENT_TYPES.EventService) private eventService: EventService) {}

    async createEvent  (req: Request, res: Response) {
        try{
            const dto = plainToInstance(CreateEventDTO, req.body);

            const project = await this.eventService.createEvent(dto);
            res.status(200).json(project);
        }
        catch(err){
            res.status(500).json({message: err.message});
        }
    }

    async getEvents(req: Request, res: Response) {
        try{
            const page = req.query.page  ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            
            const events = await this.eventService.getAllEvents(page, limit);

            res.status(200).json(events);
        }
        catch(err){
            res.status(500).json({message: err.message});
        }
    }
}