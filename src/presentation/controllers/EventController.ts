import { Request, Response } from 'express';
import {inject, injectable} from "inversify";
import {EVENT_TYPES} from "../../container/types/EventTypes.";
import {plainToInstance} from 'class-transformer';
import {EventService} from "../../application/services/EventService";
import {CreateEventDTO} from "../../application/dto/request/CreateEventDTO";
import {EventFilters, S3File} from "../../types";
import {AuthenticatedRequest} from "../middlewares/AuthMiddleware";

@injectable()
export class EventController {
    constructor(@inject(EVENT_TYPES.EventService) private eventService: EventService) {}

    async createEvent  (req: Request, res: Response) {
        try{
            const userId = (req as AuthenticatedRequest).user?.id!;

            const dto = plainToInstance(CreateEventDTO, req.body);
            const file = req.file as S3File;
            let photoUrl;
            
            if (file) {
                photoUrl = await this.eventService.uploadFiles(file);
                console.log("Photo URLs:", photoUrl);
            }

            const event = await this.eventService.createEvent(dto, userId, photoUrl);
            res.status(200).json(event);
        }
        catch(err){
            res.status(500).json({message: err.message});
        }
    }

    async getEvents(req: Request, res: Response) {
        try{
            const page = req.query.page  ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            
            const filters: EventFilters = {};
            
            if (req.query.location && typeof req.query.location === 'string') {
                filters.location = req.query.location;
            }
            
            if (req.query.categories) {
                if (Array.isArray(req.query.categories)) {
                    filters.categories = req.query.categories as string[];
                } else if (typeof req.query.categories === 'string') {
   
                    const categoriesStr = req.query.categories;
                    filters.categories = categoriesStr.includes(',') 
                        ? categoriesStr.split(',') 
                        : categoriesStr;
                }
            }
            
            if (req.query.eventDate && typeof req.query.eventDate === 'string') {
                const dateStr = req.query.eventDate;
                if (!isNaN(new Date(dateStr).getTime())) {
                    filters.eventDate = dateStr;
                }
            }
            
            if (req.query.showCompleted !== undefined) {
                filters.showCompleted = req.query.showCompleted === 'true';
            }
            const events = await this.eventService.getAllEvents(page, limit, filters);
            
            res.status(200).json(events);
        }
        catch(err){
            res.status(500).json({message: err.message});
        }
    }
    async getEventById(req: Request, res: Response) {
        try{
            const id = req.params.id;
            const event = await this.eventService.getEventById(id);
            res.status(200).json(event);
        }
        catch(err){
            res.status(500).json({message: err.message});
        }
    }
    async getCategories(req: Request, res: Response) {
        try{
            const categories = await this.eventService.getCategories();
            res.status(200).json(categories);
        }
        catch(err) {
            res.status(500).json({message: err.message});
        }
    }
}