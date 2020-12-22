import type { Context } from './deps/oak.ts';

export default ({ response }: Context) => {
    response.status = 404;
    response.body = {
        error: 'Requested resource can not be found'
    };
}
