import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

const userSchema = new mongoose.Schema({
  userID: { type: Number, unique: true },
  name: { type: String },
  email: { type: String, unique: true },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  googleId: { type: String, unique: true, sparse: true },
  genres: [
    {
      name: {
        type: String,
        required: true,
      },
      description: { type: String, default: "" },
    },
  ],
});

userSchema.plugin(AutoIncrement, { inc_field: "userID" });

export default mongoose.model("User", userSchema);
