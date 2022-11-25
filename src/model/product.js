
import { Schema, model } from "mongoose";

const productSchema = new Schema(
	{
	
	name: {
		type: String
		
	  },
	  price: {
		type: Number
		
	  }
	
})

export default model("product", productSchema);

