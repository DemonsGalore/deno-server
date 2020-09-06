import { JwtValidation, validateJwt } from 'https://deno.land/x/djwt@v1.2/validate.ts';
import { config } from 'https://deno.land/x/dotenv@v0.5.0/mod.ts';
import { Context } from 'https://deno.land/x/oak@v6.1.0/mod.ts';

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
