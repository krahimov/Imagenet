import { auth } from "@clerk/nextjs/server";
import { Schema, model, models } from "mongoose";
import { transform } from "next/dist/build/swc/generated-native";
import { config } from "process";


export interface IImage {
    _id?: string;
    title: string;
    transformationType: string;
    aspectRatio: string;
    color: string;
    width: number;
    height: number;
    prompt: string;
    publicId: string;
    secureUrl: string;
    config?: object;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    author: {
        _id: string;
        firstName: string;
        lastName: string;
    };
}
const imageSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    transformationType: {
        type: String,
        required: true
    },
    aspectRatio: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    prompt: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    secureUrl: {
        type: String,
        required: true
    },
    config: {
        type: Object
    },
    userId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: String,
        required: true
    }
})

const Image = models?.Image || model('Image', imageSchema);


export default imageSchema