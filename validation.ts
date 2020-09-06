import { Request, Response } from 'https://deno.land/x/oak@v6.1.0/mod.ts';

import { User } from './models/users.ts';

export const validateUser = async (request: Request, response: Response): Promise<User | undefined> => {
    const body = await request.body();
    const user: User = await body.value;

    if (!user) {
        response.status = 400;
        response.body = {
            success: false,
            msg: 'No data'
        };

        return;
    }

    // TODO: refactor with ['username', 'password'].forEach

    // TODO: multiple errors

    if (!user.username) {
        response.status = 400;
        response.body = {
            success: false,
            msg: 'Username required'
        };

        return;
    }

    if (!user.password) {
        response.status = 400;
        response.body = {
            success: false,
            msg: 'Password required'
        };

        return;
    }

    return user;
}

export const validateUpdateUser = async (request: Request, response: Response): Promise<User | undefined> => {
    const body = await request.body();
    const user: User = await body.value;

    if (!user) {
        response.status = 400;
        response.body = {
            success: false,
            msg: 'No data'
        };

        return;
    }

    return user;
}

export const validateSignInUser = async (request: Request, response: Response): Promise<User | undefined> => {
    const body = await request.body();
    const user: User = await body.value;

    if (!user) {
        response.status = 400;
        response.body = {
            success: false,
            msg: 'No data'
        };

        return;
    }

    // TODO: refactor with ['username', 'password'].forEach

    // TODO: multiple errors

    // only validate username/email and password

    if (!user.username) {
        response.status = 400;
        response.body = {
            success: false,
            msg: 'Username required'
        };

        return;
    }

    if (!user.password) {
        response.status = 400;
        response.body = {
            success: false,
            msg: 'Password required'
        };

        return;
    }

    return user;
}
