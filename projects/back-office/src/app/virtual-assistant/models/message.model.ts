import { User } from './user.model';
import {Choices} from './choices.model';

export class Message {
    type: string;
    text: string;
    reply: string;
    user: User;
    date: number;
    choices: Choices[];

    // tslint:disable-next-line:max-line-length
    constructor(type: string,
                text: string,
                reply: string,
                user: User,
                date: number,
                choices: Choices[]) {
        this.type = type;
        this.text = text;
        this.reply = reply;
        this.user = user;
        this.date = date;
        this.choices = choices;
    }
}
