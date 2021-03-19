import { Schema, Document, model } from "mongoose";

export interface Entity extends Document {
    id: string,
    stringField: string;
    intField: number;
    enumField: string;
    stringArrayField: [string];
    boolField: boolean;
}

const EntitySchema: Schema = new Schema({
    id: {
        type: String,
        required: true
    },
    stringField: {
        type: String,
        required: true,
    },
    intField: {
        type: Number,
        required: true,
    },
    enumField: {
        type: String,
        enum: ['A', 'B', 'C', 'D'],
        required: true,
    },
    stringArrayField: {
        type: [String],
        required: true,
    },
    boolField: {
        type: Boolean,
        required: true,
    },
});

export default model<Entity>("Entity", EntitySchema);
