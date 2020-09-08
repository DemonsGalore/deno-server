import { Application, isHttpError } from 'https://deno.land/x/oak@v6.1.0/mod.ts';
import { config } from 'https://deno.land/x/dotenv@v0.5.0/mod.ts';

import router from './router.ts';
import notFound from './404.ts';
import GraphQLService from "./graphql.ts";

const env = config();
const HOST = env.APP_HOST || 'http://localhost';
const PORT = +env.APP_PORT || 5000;

const app = new Application();

// GraphQL
app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

// FIXME: is it even working?
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        if (isHttpError(error)) {
            switch (error.status) {
                case 404:
                    ctx.response.status = 404;
                    ctx.response.body = {
                        error: 'Requested resource can not be found'
                    };

                    break;
                default:
                    ctx.response.status = 400;
                    ctx.response.body = {
                        error: 'Request can not be processed currently'
                    };

                    break;
            }
        } else {
            ctx.response.status = 500;
            ctx.response.body = {
                error: 'Something went wrong'
            };
        }
    }
});

// REST
app.use(router.routes());
app.use(router.allowedMethods());
// TODO: remove if error handling is working
app.use(notFound);

console.log(`Server is running on ${HOST}:${PORT}`);

await app.listen({ port: PORT });
