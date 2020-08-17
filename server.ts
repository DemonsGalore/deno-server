import { Application } from 'https://deno.land/x/oak@v6.0.1/mod.ts';
import router from './routes.ts';

const port = 5000;

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server is running on http://localhost:${port}`);

await app.listen({ port })
