import { config } from "dotenv";
config();

export default {
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost/apimigrañas",
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET || 'apimigraine',
  JWT_ACCOUNT_ACTIVATION:process.env.JWT_ACCOUNT_ACTIVATION||'apimigraine',
  JWT_RESET_PASSWORD:process.env.JWT_RESET_PASSWORD||'apimigraine',
  MAIL_KEY :process.env.MAIL_KEY || "", 
  EMAIL_TO:process.env.EMAIL_TO||'guillermolaura333@gmail.com' ,
  EMAIL_FROM:process.env.EMAIL_FROM||'jguillermolaura@gmail.com',
  EMAIL_PASSAPP: process.env.EMAIL_PASSAPP||'12345',
  CLIENT_URL: process.env.CLIENT_URL|| 'http://localhost:4000'
};

//mongodb://localhost/apimigrañas
//mongodb+srv://guille:8301405gl@cluster0.gaubm.mongodb.net/?retryWrites=true&w=majority
