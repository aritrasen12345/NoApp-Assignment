import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      default: "",
    },
    password: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
