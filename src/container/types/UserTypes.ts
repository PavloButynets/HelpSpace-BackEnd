const USER_TYPES = {
    IUserRepository: Symbol.for("IUserRepository"),
    UserService: Symbol.for("UserService"),
    UserController: Symbol.for("UserController"),
}

export { USER_TYPES };