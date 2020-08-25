export interface UserSchema {
    _id: { $oid: string };
    username: string;
    password: string;
}

export interface User {
    username: string;
    password: string;
}
