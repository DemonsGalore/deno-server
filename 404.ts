import { Context } from 'https://deno.land/x/oak@v6.1.0/mod.ts';

export default ({ response }: Context) => {
    response.status = 404;
    response.body = {
        error: 'Requested resource can not be found'
    };
}
