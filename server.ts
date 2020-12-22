import { Application, isHttpError } from './deps/oak.ts';
import { config } from './deps/dotenv.ts';

import router from './router.tsx';
import notFound from './404.ts';
import GraphQLService from './graphql.ts';
// import { page } from './pages/index.jsx';

const env = config();
const HOST = env.APP_HOST || 'http://localhost';
const PORT = +env.APP_PORT || 5000;

const app = new Application();

// Request type and route
app.use(async (ctx, next) => {
    console.log(`HTTP ${ctx.request.method} on ${ctx.request.url}`);
    await next();
});

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
                        error: 'Request can currently not be processed'
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
app.use(router.routes(), router.allowedMethods());

// GraphQL
app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

// Send static content
app.use(async (context) => {
    await context.send({
        root: `${Deno.cwd()}/ui/react-ui/build`,
        index: 'index.html',
    });
});

// TODO: remove if error handling is working
app.use(notFound);

console.log(`Server is running on ${HOST}:${PORT}`);

await app.listen({ port: PORT });


// TODO: CORS
// import { oakCors } from "https://deno.land/x/cors/mod.ts";
// app.use(oakCors());