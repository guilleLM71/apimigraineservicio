import { Schema, model } from "mongoose";

export const ROLES = ["user", "admin", "doctor"];

const roleSchema = new Schema(
  {
    name: String,
  },
  {
    versionKey: false,
  }
);

export default model("role", roleSchema);
