import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);


const userSchema = new mongoose.Schema({
    userID: { type: Number, unique: true },
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String, required: true },
})

userSchema.plugin(AutoIncrement, { inc_field: 'userID' });

export default mongoose.model("User", userSchema);