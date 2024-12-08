import { Schema, model, models } from "mongoose";
import { transform } from "next/dist/build/swc/generated-native";
import { unique } from "next/dist/build/utils";
import { config } from "process";


// generate transaction schema interface



const transactionSchema = new Schema({
    buyer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    stripeId: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
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
});

const Transaction = models.Transaction || model("Transaction", transactionSchema);
export default Transaction;