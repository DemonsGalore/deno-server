import { ObjectId } from '../deps/mongo.ts';
import type { Context, Request, Response, RouteParams } from '../deps/oak.ts';
import { bcrypt } from '../deps/bcrypt.ts';

import db from '../database.ts';
import type { UserSchema, User } from '../models/users.ts';
import { validateUser, validateUpdateUser } from '../validation.ts';

const users = db.collection<UserSchema>('users');

// @desc    Get all users
// @route   GET /api/users
export const getUsers = async ({ response }: Context) => {
    const allUsers = await users.find({ username: { $ne: null } });

    response.body = {
        success: true,
        data: allUsers
    };
};

// @desc    Get single user
// @route   GET /api/users/:id
export const getUser = async ({ params, response }: { params: RouteParams, response: Response }) => {
    const { id } = params as { id: string };

    try {
        const user: UserSchema | null = await users.findOne({ _id: ObjectId(id) });

        response.body = {
            success: true,
            data: user
        };
    } catch (error) {
        response.status = 404;
        response.body = {
            success: false,
            msg: 'No user found'
        };
    }
};

// @desc    Add user
// @route   POST /api/users
export const addUser = async ({ request, response }: Context) => {
    const user: User | undefined = await validateUser(request, response);

    if (user !== undefined) {
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(user.password, salt);

        const insertId = await users.insertOne({
            username: user.username,
            password: hash,
            createdAt: new Date()
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
export const updateUser = async ({ params, request, response }: { params: RouteParams, request: Request, response: Response }) => {
    const user: User | undefined = await validateUpdateUser(request, response);
    const { id } = params as { id: string };

    if (user !== undefined) {
        try {
            await users.updateOne(
                { _id: ObjectId(id) },
                { $set: { username: user.username, password: user.password } }
            );

            response.body = {
                success: true,
                msg: 'User updated'
            };
        } catch (error) {
            response.status = 404;
            response.body = {
                success: false,
                msg: 'No user found'
            };
        }
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
export const deleteUser = async ({ params, response }: { params: RouteParams, response: Response }) => {
    const { id } = params as { id: string };

    try {
        await users.deleteOne({ _id: ObjectId(id) });

        response.status = 204;
        response.body = {
            success: true,
            msg: 'User deleted'
        };
    } catch (error) {
        response.status = 404;
        response.body = {
            success: false,
            msg: 'User not found'
        };
    }
};
