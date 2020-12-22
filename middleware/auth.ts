import type { Context } from '../deps/oak.ts';
import { JwtValidation, validateJwt } from '../deps/djwt.ts';
import { config } from '../deps/dotenv.ts';

const env = config();
const key = env.JWT_SECRET;

const authMiddleware = async (context: Context, next: any) => {
    const { request, response } = context;
    const authorization = request.headers.get('Authorization') ? request.headers.get('Authorization')! : '';
    const jwt = authorization.replace('Bearer ', '');
    const tokenValidation: JwtValidation = await validateJwt({ jwt, key, algorithm: 'HS256' });

    if (!tokenValidation.isValid) {
        response.status = 401;
        response.body = {
            success: false,
            msg: 'Unauthorized'
        }

        return;
    }
    await next();
}

export default authMiddleware;
