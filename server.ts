import { Application } from 'https://deno.land/x/oak@v6.0.1/mod.ts';
import { config } from 'https://deno.land/x/dotenv@v0.5.0/mod.ts';

import router from './routes.ts';
import notFound from './404.ts';

const env = config();
const HOST = env.APP_HOST || 'http://localhost';
const PORT = +env.APP_PORT || 5000;

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());
app.use(notFound);

console.log(`Server is running on ${HOST}:${PORT}`);

await app.listen({ port: PORT });
