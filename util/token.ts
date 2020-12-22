import type { Request, Response } from '../deps/oak.ts';
import { JwtValidation, makeJwt, setExpiration, validateJwt, Jose, Payload } from '../deps/djwt.ts';
import { config } from '../deps/dotenv.ts';

import type { UserSchema } from '../models/users.ts';

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
