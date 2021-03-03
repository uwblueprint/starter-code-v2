import mongoose, { Schema, Document, model } from "mongoose";

export interface IEntity extends Document {
    string_field: string;
    int_field: number;
    enum_field: string;
    string_array_field: [string];
    bool_field: Boolean;
}

const EntitySchema: Schema = new Schema({
    string_field: {
        type: String,
        required: true,
    },
    int_field: {
        type: Number,
        required: true,
    },
    enum_field: {
        type: String,
        enum: ['A', 'B', 'C', 'D'],
        required: true,
    },
    string_array_field: {
        type: [String],
        required: true,
    },
    bool_field: {
        type: Boolean,
        required: true,
    },
});

export const Entity = model<IEntity>("Entity", EntitySchema);
