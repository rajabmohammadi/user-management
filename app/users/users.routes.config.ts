import { CommonRoutesConfig } from "../../common/common.routes.config";
import UsersController from "./controllers/users.controller";
import UsersMiddleware from "./middleware/users.middleware";
import BodyValidationMiddleware from "../../common/middleware/body.validation.middleware";
import { body } from "express-validator";
import ValidUsersExists from "../../common/middleware/valid.users.exists";
import express from "express";

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UsersRoutes");
  }

  configureRoutes(): express.Application {
    //============= USER CRUD ====================
    this.app.route('/user')
      .post(
        body("email").isEmail(),
        body("firstName").isString(),
        body("lastName").isString(),
        body("password").isLength({ min: 5 }).withMessage("Must include password (5+ characters)"),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        UsersMiddleware.validateSameEmailDoesNotExist,
        UsersController.createNewUser,
        UsersMiddleware.createJWT
      )
      .put(
        body("email").isEmail().optional(),
        body("firstName").isString().optional(),
        body("lastName").isString().optional(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        UsersMiddleware.validJWTNeeded,
        ValidUsersExists.validUsersExistWithUserId,
        UsersMiddleware.userCantChangePermission,
        UsersController.updateUser,
      )
      .get(
        UsersMiddleware.validJWTNeeded,
        UsersController.getUserById
      )
    //=========== login section ============
    this.app.route('/login')
      .post(
        body('email').isEmail(),
        body('password').isString(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        UsersMiddleware.validateUserExistsWithEmail,
        UsersMiddleware.verifyUserPassword,
        UsersMiddleware.createJWT,
      );
    //========== Refresh Token =============
    this.app.route('/refresh-token')
      .post(
        body('refreshToken').isString(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        UsersMiddleware.validJWTNeeded,
        UsersMiddleware.validRefreshNeeded,
        UsersMiddleware.createJWT,
      );


    return this.app;
  }
}
