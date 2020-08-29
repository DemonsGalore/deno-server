import { ObjectId } from 'https://deno.land/x/mongo@v0.11.0/mod.ts';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts';

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
    try {
        const user: UserSchema | null = await users.findOne({ _id: ObjectId(params.id) });

        response.body = {
            success: true,
            data: user
        }
    } catch (error) {
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
export const updateUser = async ({ params, request, response }: { params: { id: string }, request: any, response: any }) => {
    const user: User | undefined = await validateUpdateUser(request, response);

    if (user !== undefined) {
        try {
            await users.updateOne(
                { _id: ObjectId(params.id) },
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
            }
        }
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
export const deleteUser = async ({ params, response }: { params: { id: string }, response: any }) => {
    try {
        await users.deleteOne({ _id: ObjectId(params.id) });

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
