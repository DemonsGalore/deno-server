import { parseAndDecode, validateJwtObject, JwtObject } from 'https://deno.land/x/djwt@v1.2/validate.ts';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts';
import { Context } from 'https://deno.land/x/oak@v6.1.0/mod.ts';

import db from '../database.ts';
import { User, UserSchema } from '../models/users.ts';
import { validateSignInUser } from '../validation.ts';
import { generateToken } from '../util/token.ts';

const users = db.collection<UserSchema>('users');

// @desc    Sign in user
// @route   GET /signin
export const signIn = async ({ request, response }: Context) => {
    const user: User | undefined = await validateSignInUser(request, response);

    if (user) {
        const signedInUser: UserSchema | null = await users.findOne({ username: user.username });

        if (signedInUser) {
            const passwordMatched = await bcrypt.compare(user.password, signedInUser.password);

            if (passwordMatched) {
                const token = await generateToken(signedInUser);

                response.body = {
                    success: true,
                    data: token
                };
            } else {
                response.status = 401;
                response.body = {
                    success: false,
                    msg: 'Password is incorrect'
                };
            }
        } else {
            response.status = 404;
            response.body = {
                success: false,
                msg: 'No user found'
            };
        }
    }
};

// @desc    Get signed in user data
// @route   GET /me
export const me = async ({ request, response }: Context) => {
    const authorization = request.headers.get('Authorization') ? request.headers.get('Authorization')! : '';
    const jwt = authorization.replace('Bearer ', '');
    const decodedToken: JwtObject = validateJwtObject(parseAndDecode(jwt));
    // TODO: type to PayloadObject?
    const payload: any = decodedToken.payload;

    response.status = 200;
    response.body = {
        success: true,
        data: JSON.parse(payload.content)
    };
}
