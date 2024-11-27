import { auth } from "@clerk/nextjs/server";
import { Schema, model, models } from "mongoose";
import { transform } from "next/dist/build/swc/generated-native";
import { config } from "process";


export interface IUser {
    clerkId: string;
    username: string;
    firstName: string;
    lastName: string;
    planId: string;
    email: string;
    photo: string;
    creditBalance: number;
    createdAt: Date;
    updatedAt: Date;
}



const userSchema = new Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    planId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    creditBalance: {
        type: Number,
        required: true
    }, 
    createdAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true
    }
})

const User = models?.User || model('User', userSchema);

export default User