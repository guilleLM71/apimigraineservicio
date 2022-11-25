import { Schema, model } from "mongoose";


const sintomasSchema = new Schema(
  {
    sintomas:[],
  },
  {
    versionKey: false,
  }
);

export default model("sintomas", sintomasSchema);
