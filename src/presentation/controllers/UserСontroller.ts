import { Request, Response } from 'express';
import { UserService } from "../../application/services/UserService";
import {inject, injectable} from "inversify";
import {USER_TYPES} from "../../container/types/UserTypes";

@injectable()
export class UserController {
    constructor(@inject(USER_TYPES.UserService) private userService: UserService) {}

    async getUsers  (req: Request, res: Response) {
        try{
            //const users = await this.userService.getUsers();

            return [];
        }
        catch(err){
            console.log(err);
            return res.status(500).json({message: err.message});
        }
    }
}