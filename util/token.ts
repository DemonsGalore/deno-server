import { JwtValidation, validateJwt } from 'https://deno.land/x/djwt@v1.2/validate.ts';
import { makeJwt, setExpiration, Jose, Payload } from 'https://deno.land/x/djwt@v1.2/create.ts';
import { config } from 'https://deno.land/x/dotenv@v0.5.0/mod.ts';
import { Request, Response } from 'https://deno.land/x/oak@v6.1.0/mod.ts';

import { UserSchema } from '../models/users.ts';

const env = config();
const key = env.JWT_SECRET;

const header: Jose = {
    alg: 'HS256',
    typ: 'JWT'
};

export const generateToken = async (user: UserSchema): Promise<string> => {
    const payload: Payload = {
        content: JSON.stringify({
            id: user._id.$oid,
            username: user.username,
            createdAt: user.createdAt
        }),
        exp: setExpiration(60 * 60)
    };

    return makeJwt({ header, payload, key });
}

export const validateToken = async (request: Request, response: Response): Promise<boolean> => {
    const authorization = request.headers.get('authorization');

    if (authorization) {
        const jwt = authorization.replace('Bearer ', '');
        const tokenValidation: JwtValidation = await validateJwt({ jwt, key, algorithm: 'HS256' });

        if (tokenValidation.isValid) {
            return true;
        } else {
            response.status = 401;
            response.body = {
                success: false,
                msg: 'Unauthorized'
            }

            return false;
        }
    } else {
        response.status = 401;
        response.body = {
            success: false,
            msg: 'Unauthorized'
        }

        return false;
    }
}
