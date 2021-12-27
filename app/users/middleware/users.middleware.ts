import express from "express";
import User from "../../../common/models/users.model";
import debug from 'debug';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import * as argon2 from 'argon2';
import { Jwt } from '../../../common/types/jwt';
const log: debug.IDebugger = debug('app:auth-controller');
const jwtSecret: any = process.env.JWT_SECRET;
const tokenExpirationInSeconds = process.env.TOKEN_EXPIRERS

class UsersMiddleware {
  //check duplicate user.
  async validateSameEmailDoesNotExist(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        res.status(400).json({
          errors: ["User with email address already exists"],
        })
      } else {
        next();
      }
    } catch (err) {
      res.status(400).send({ errors: [err.message] });
    }

  }
  //check user already exit with email.
  async validateUserExistsWithEmail(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      let user = await User.findOne({ email: req.body.email })
      if (user) {
        next();
      } else {
        res.status(400).json({
          errors: ["User not found"],
        })
      }
    } catch (err) {
      res.status(400).send({ errors: [err.message] });
    }

  }

  async userCantChangePermission(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      if ("permissionFlags" in req.body && req.body.permissionFlags !== res.locals.jwt.permissionFlags) {
        res.status(400).json({
          errors: ["User cannot change permission flags"],
        });
      } else {
        next();
      }
    } catch (err) {
      res.status(400).send({ errors: [err.message] });
    }

  }
  // create JWT token.
  async createJWT(req: express.Request, res: express.Response) {
    try {
      //create a refreshId for refresh token.
      const refreshId = req.body.userId + jwtSecret;
      const salt = crypto.createSecretKey(crypto.randomBytes(16));
      const hash = crypto.createHmac('sha512', salt).update(refreshId).digest('base64');
      req.body.refreshKey = salt.export();
      //create a token with jwt.
      const token = jwt.sign(req.body, jwtSecret, {
        expiresIn: tokenExpirationInSeconds,
      });
      let data = { "user": req.body, "accessToken": token, "refreshToken": hash }
      return res.status(201).json({
        "data": data
      });
    } catch (err) {
      res.status(400).send({ errors: [err.message] });
    }
  }
  //check password.
  async verifyUserPassword(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      let user = await User.findOne({ email: req.body.email })
      if (user) {
        const passwordHash = user.password;
        if (await argon2.verify(passwordHash, req.body.password)) {
          req.body = {
            userId: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            permissionFlags: user.permissionFlags,
          };
          next();
        } else {
          res.status(400).json({ errors: ['Invalid email and/or password'] });
        }
      }

    } catch (err) {
      res.status(400).send({ errors: [err.message] });
    }
  }

  async validRefreshNeeded(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const user: any = await User.findOne({ email: res.locals.jwt.email });
      const salt = crypto.createSecretKey(
        Buffer.from(res.locals.jwt.refreshKey.data)
      );
      const hash = crypto.createHmac('sha512', salt).update(res.locals.jwt.userId + jwtSecret).digest('base64');
      if (hash === req.body.refreshToken) {
        req.body = {
          userId: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          permissionFlags: user.permissionFlags,
        };
        return next();
      } else {
        return res.status(400).send({ errors: ['Invalid refresh token'] });
      }
    } catch (err) {
      res.status(400).send({ errors: [err.message] });
    }

  }
  //verify jwt
  validJWTNeeded(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      if (req.headers['authorization']) {
        const authorization = req.headers['authorization'].split(' ');
        if (authorization[0] !== 'Bearer') {
          return res.status(401).send();
        } else {
          res.locals.jwt = jwt.verify(authorization[1], jwtSecret) as Jwt;
          next();
        }
      } else {
        return res.status(401).json({ 'message': "Unauthorized" });
      }
    } catch (err) {
      res.status(400).send({ errors: [err.message] });
    }

  }


}



export default new UsersMiddleware();
