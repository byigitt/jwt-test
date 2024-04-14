import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  password_reset_token: {
    type: String,
    default: null,
  },
  password_reset_expires: {
    type: Date,
    default: null,
  },
});

export default model("User", userSchema);
