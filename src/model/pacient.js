import { Schema, model } from "mongoose";



const pacientSchema = new Schema(
  {
    ci:String,
    nombre: String,
    sintomas:[],
    diagnostico:String,
    iddoc:String
  },
  {
    versionKey: false,
  }
);

export default model("pacient", pacientSchema);