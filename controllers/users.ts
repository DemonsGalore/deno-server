import db from '../database.ts';
import { UserSchema, User } from '../models/users.ts';
import { validateUser, validateUpdateUser } from '../validation.ts';

const users = db.collection<UserSchema>('users');

// @desc    Get all users
// @route   GET /api/users
export const getUsers = async ({ response }: { response: any }) => {
    const allUsers = await users.find({ username: { $ne: null } });

    response.body = {
        success: true,
        data: allUsers
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
export const getUser = async ({ params, response }: { params: { id: string }, response: any }) => {
    const user: UserSchema | null = await users.findOne({ _id: { $oid: params.id } });

    // FIXME: error for invalid id

    if (user) {
        response.status = 200;
        response.body = {
            success: true,
            data: user
        }
    } else {
        response.status = 404;
        response.body = {
            success: false,
            msg: 'No user found'
        }
    }
};

// @desc    Add user
// @route   POST /api/users
export const addUser = async ({ request, response }: { request: any, response: any }) => {
    const user: User | undefined = await validateUser(request, response);

    if (user !== undefined) {
        const insertId = await users.insertOne({
            username: user.username,
            password: user.password
        });

        response.status = 201;
        response.body = {
            success: true,
            data: insertId
        };
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
export const updateUser = async ({ params, request, response }: { params: { id: string }, request: any, response: any }) => {
    const user: User | undefined = await validateUpdateUser(request, response);

    if (user !== undefined) {
        const { matchedCount, modifiedCount, upsertedId } = await users.updateOne(
            { _id: { $oid: params.id } },
            { $set: { username: user.username, password: user.password } }
        );

        console.log(matchedCount);
        console.log(modifiedCount);
        console.log(upsertedId);

        // TODO: add response for failed request

        response.body = {
            success: true,
            msg: 'User updated'
        };
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
export const deleteUser = async ({ params, response }: { params: { id: string }, response: any }) => {
    const deleteCount = await users.deleteOne({ _id: { $oid: params.id } });

    // FIXME: error for invalid id

    if (deleteCount === 1) {
        response.body = {
            success: true,
            msg: 'User deleted'
        };
    } else {
        response.status = 404;
        response.body = {
            success: false,
            msg: 'User not found'
        };
    }
};
