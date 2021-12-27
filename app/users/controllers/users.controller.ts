import express from 'express';
import UserDao from '../daos/users.dao';
import argon2 from 'argon2';
import debug from 'debug';
const log: debug.IDebugger = debug('app:users-controller');

class UsersController {
    async getUserById(req: express.Request, res: express.Response) {
        try {
            let userId = res.locals.jwt.userId;
            const users = await UserDao.find(userId);
            res.status(200).json({
                "data": users
            })
        } catch (err) {
            res.status(400).json({
                errors: [err.message],
            })
        }
    }

    //============= add new user ==============
    async createNewUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            req.body.password = await argon2.hash(req.body.password);
            const user = await UserDao.save(req.body);
            if (user) {
                next();
            }
        } catch (err) {
            res.status(400).json({
                errors: [err.message],
            })
        }

    }
    //=========== update user profile =============
    async updateUser(req: express.Request, res: express.Response) {
        try {
            let user = await UserDao.put(res.locals.jwt.userId, req.body);
            res.status(200).json({
                "message": "Profile edited successfully",
                "data": user
            });
        } catch (err) {
            res.status(400).json({
                errors: [err.message],
            })
        }

    }
    //============ update password with email address =========
    async putPasswordWithEmail(req: express.Request, res: express.Response) {
        try {
            req.body.password = await argon2.hash(req.body.password);
            await UserDao.changePasswordWithEmail(req.body.email, req.body);
            res.status(200).json({
                "message": "Password changed successfully"
            });

        } catch (err) {
            res.status(400).json({
                errors: [err.message],
            })
        }

    }


}

export default new UsersController();
