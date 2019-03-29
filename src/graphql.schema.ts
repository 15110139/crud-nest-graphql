/* tslint:disable */
export abstract class IQuery {
    abstract getUser(userId: string): User | Promise<User>;

    abstract getUsers(): User[] | Promise<User[]>;

    abstract temp__(): boolean | Promise<boolean>;
}

export class User {
    _id: string;
    username?: string;
    password?: string;
}
