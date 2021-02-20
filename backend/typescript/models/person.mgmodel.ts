import mongoose, { Schema, Document } from "mongoose";

export interface Person extends Document {
    name: string;
    email: string;
}

const PersonSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
});

export default mongoose.model<Person>("Person", PersonSchema);
