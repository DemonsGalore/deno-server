import { parseAndDecode, validateJwtObject, JwtObject } from '../deps/djwt.ts';
import { bcrypt } from '../deps/bcrypt.ts';
import type { Context } from '../deps/oak.ts';

import db from '../database.ts';
import type { User, UserSchema } from '../models/users.ts';
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
