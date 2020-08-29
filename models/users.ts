export interface UserSchema {
    _id: { $oid: string };
    username: string;
    password: string;
    createdAt: Date;
}

export interface User {
    username: string;
    password: string;
}
