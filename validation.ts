import { User } from './models/users.ts';


export const validateUser = async (request: any, response: any): Promise<User | undefined> => {
    const body = await request.body();
    const user: User = await body.value;

    if (!user) {
        response.status = 400;
        response.body = {
            success: false,
            msg: 'No data'
        };

        return;
    }

    // TODO: refactor with ['username', 'password'].forEach

    if (!user.username) {
        response.status = 400;
        response.body = {
            success: false,
            msg: 'Username required'
        };

        return;
    }

    if (!user.password) {
        response.status = 400;
        response.body = {
            success: false,
            msg: 'Password required'
        };

        return;
    }

    return user;
}
