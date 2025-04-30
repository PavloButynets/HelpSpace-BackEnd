import { Request, Response } from "express";
import { UserService } from "../../application/services/UserService";
import { inject, injectable } from "inversify";
import { USER_TYPES } from "../../container/types/UserTypes";

@injectable()
export class UserController {
  constructor(
    @inject(USER_TYPES.UserService) private userService: UserService
  ) {}

  async getUsers(req: Request, res: Response) {
    const users = await this.userService.getUsers();

    res.status(200).json(users);
  }

  async getUserById(req: Request, res: Response) {
    const userId = req.params.id;
    const user = await this.userService.getUserById(userId);

    res.status(200).json(user);
  }

  async getUserFeedbacks(req: Request, res: Response) {
    const userId = req.params.id;
    const feedbacks = await this.userService.getUserFeedbacks(userId);

    res.status(200).json(feedbacks);
  }
}
