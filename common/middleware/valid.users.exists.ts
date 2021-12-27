import express from 'express';
import User from "../models/users.model"
import { validationResult } from 'express-validator';

class ValidUsersExists {
    async validUsersExistWithUserId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            let user = await User.findById(res.locals.jwt.userId);
            console.log('userId', res.locals.jwt.userId);
            if (user) {
                next();
            } else {
                res.status(404).json({
                    'message': `User ${res.locals.jwt.userId} not found`
                });
                res.status(404).json({
                    errors: [`User ${res.locals.jwt.userId} not found`]
                })
            }
        } catch (err) {
            res.status(400).json({
                errors: [err.message],
            })
        }

    }
}

export default new ValidUsersExists();
