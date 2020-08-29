import * as bcrypt from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts';

import { User, UserSchema } from '../models/users.ts';
import { validateSignInUser } from '../validation.ts';
import db from '../database.ts';

const users = db.collection<UserSchema>('users');

// @desc    Sign in user
// @route   GET /signin
export const signIn = async ({ request, response }: { request: any, response: any }) => {
    const user: User | undefined = await validateSignInUser(request, response);

    if (user) {
        const signedInUser: UserSchema | null = await users.findOne({ username: user.username });

        if (signedInUser) {
            const passwordMatched = await bcrypt.compare(user.password, signedInUser.password);

            if (passwordMatched) {
                response.body = {
                    success: true,
                    data: signedInUser
                }
            } else {
                response.status = 401;
                response.body = {
                    success: false,
                    msg: 'Password is incorrect'
                }
            }
        } else {
            response.status = 404;
            response.body = {
                success: false,
                msg: 'No user found'
            }
        }
    }
};
