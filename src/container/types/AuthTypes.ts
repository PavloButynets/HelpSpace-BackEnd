const AUTH_TYPES = {
    AuthService: Symbol.for("AuthService"),
    AuthController: Symbol.for("AuthController"),
    AuthMiddleware: Symbol.for("AuthMiddleware"),
}

export { AUTH_TYPES };