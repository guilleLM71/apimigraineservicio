import User from "../model/user";
import Role from "../model/role";

import jwt from "jsonwebtoken";
import config from "../config";

const { google } = require('googleapis')
const { OAuth2 } = google.auth
const client = new OAuth2(process.env.GOOGLE_CLIENT)

const _ = require("lodash");

const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");

const { validationResult } = require("express-validator");

//const { errorHandler } = require('../helpers/dbErrorHandling');
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.MAIL_KEY);

const nodemailer = require("nodemailer");

export const signUp = async (req, res) => {
  try {
    // Getting the Request Body
    const { username, email, password, roles, sintomas, diagnostico } =
      req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      return res.status(422).json({
        errors: firstError,
      });
    } else {
      // Create a token
      /*
      const token = jwt.sign(
        { id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
          password:savedUser.password,
          sintomas:savedUser.sintomas,
          diagnostico:savedUser.diagnostico
        }
        , config.JWT_ACCOUNT_ACTIVATION, 
        {
        expiresIn: 86400, // 24 hours
      });
*/    
      console.log('aqui1 :>> ');
      const token = jwt.sign(
        {
          username: username,
          email: email,
          password: password
        }
        , config.JWT_ACCOUNT_ACTIVATION,
        {
          expiresIn: 86400, // 24 hours
        });



          
        console.log('aqui2 :>> ');
          // create reusable transporter object using the default SMTP transport
            let transporter = await nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 465,
              secure: true, // true for 465, false for other ports
              auth: {
                user: config.EMAIL_FROM, // generated ethereal user
                pass: config.EMAIL_PASSAPP, // generated ethereal password
              },
            });

            console.log('aqui3 :>> ',config.EMAIL_FROM);
        // send mail with defined transport object
        await transporter.sendMail({
          from: '"Activa tu cuenta " <'+config.EMAIL_FROM+'>', // sender address
          to:email , // list of receivers
          subject: "Activa tu cuenta ✔", // Subject line
          text: "Activa tu cuenta ✔", // plain text body
          html: `
          <h1>Activa tu cuenta haciendo clic en el enlace de abajo</h1>
          <p>${config.CLIENT_URL}/api/auth/activation/${token}</p>
          <hr />
          <p>Este correo tiene informacion sensible, borrelo luego de activarlo</p>
          <p>${config.CLIENT_URL}</p>
      `, // html body
        })

       await transporter.verify(function (error, success) {
          if (error) {
            console.log(error);
            return res.status(400).json({
              success: false,
              errors: err,
            });
          } else {
            console.log(`Email de activacion enviado a ${email}`);
            return res.json({
              message: `Email de activacion enviado a ${email}`,
            });
          }
        });
/*
      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Activa tu cuenta",
        html: `
                  <h1>Activa tu cuenta haciendo clic en el enlace de abajo</h1>
                  <p>${process.env.CLIENT_URL}/api/auth/activation/${token}</p>
                  <hr />
                  <p>Este correo tiene informacion sensible, borrelo luego de activarlo</p>
                  <p>${process.env.CLIENT_URL}</p>
              `,
      };

      console.log(emailData)

      await sgMail
        .send(emailData)
        .then((sent) => {
          return res.json({
            message: `Email de activacion enviado a ${email}`,
          });
        })
        .catch((err) => {
          return res.status(400).json({
            success: false,
            errors: err,
          });
        });
*/
      //return res.status(200).json({ token, status: true, title: "Registro Successfully." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const signin = async (req, res) => {
  try {
    // Request body email can be an email or username
    const userFound = await User.findOne({ email: req.body.email }).populate(
      "role"
    );

    if (!userFound) return res.status(400).json({ message: "User Not Found" });

    const matchPassword = await User.comparePassword(
      req.body.password,
      userFound.password
    );

    if (!matchPassword)
      return res.status(401).json({
        token: null,
        message: "Invalid Password",
      });

    const token = jwt.sign({ id: userFound._id }, config.JWT_SECRET, {
      expiresIn: 86400, // 24 hours
    });

    res.json({
      token,
      status: true,
      id: userFound._id,
      title: "Singin Successfully.",
    });
  } catch (error) {
    console.log(error);
  }
};

export const activacion = async (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, config.JWT_ACCOUNT_ACTIVATION, async (err, decoded) => {
      if (err) {
        console.log('Activation error');
        return res.status(401).json({
          errors: 'Expired link. Signup again'
        });
      } else {
        const { username, email, password } = jwt.decode(token);

        console.log(email);

        // Creating a new User Object
        const newUser = new User({
          username,
          email,
          password: await User.encryptPassword(password),
          sintomas: [],
          diagnostico: "Sin Diagnostico",
        });

        console.log(newUser);
        // checking for roles
        if (req.body.roles) {
          const foundRoles = await Role.find({ name: { $in: roles } });
          newUser.roles = foundRoles.map((role) => role._id);
        } else {
          const role = await Role.findOne({ name: "user" });
          newUser.roles = [role._id];
        }

        // Saving the User Object in Mongodb
        await newUser.save((err, user) => {
          if (err) {
            console.log('Save error', err);
            return res.status(401).json({
              errors: (err)
            });
          } else {
            return res.json({
              success: true,
              message: user,
              message: 'Signup success'
            });
          }
        });
      }
    });
  } else {
    return res.json({
      message: 'error happening please try again'
    });
  }
};

//const client = new OAuth2Client(process.env.GOOGLE_CLIENT);





export const googleController = async (req, res) => {
  const { idToken } = req.body;
  console.log(idToken)

  await client
    .verifyIdToken({ idToken: idToken, audience: process.env.GOOGLE_CLIENT })
    .then(response => {
      console.log('GOOGLE LOGIN RESPONSE', response)
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec(async (err, user) => {
          if (user) {
            const token = jwt.sign({ id: user._id }, process.env.GOOGLE_SECRET, {
              expiresIn: '7d'
            });
            const { _id, email, username, roles, diagnostico, sintomas } = user;
            return res.json({
              token,
              id:_id, 
              email, 
              username, 
              roles, 
              diagnostico, 
              sintomas 
            });
          } else {
            let password = email + process.env.GOOGLE_SECRET;
            user = new User({
              username:name, email:email, password:password, sintomas: [],
              diagnostico: "Sin Diagnostico",
            });
            if (req.body.roles) {
              const foundRoles = await Role.find({ name: { $in: roles } });
              user.roles = foundRoles.map((role) => role._id);
            } else {
              const role = await Role.findOne({ name: "user" });
              user.roles = [role._id];
            }

            user.save((err, data) => {
              if (err) {
                console.log('ERROR GOOGLE LOGIN ON USER SAVE', err);
                return res.status(400).json({
                  error: 'User signup failed with google'
                });
              }
              const token = jwt.sign(
                { id: data.id },
                process.env.GOOGLE_SECRET,
                { expiresIn: '7d' }
              );

              
              const { _id, email, username, roles, diagnostico, sintomas } = data;
              return res.json({
                token,
                id:_id, 
                email, 
                name, 
                roles, 
                diagnostico, 
                sintomas 
              });

            });
          }
        });
      } else {
        return res.status(400).json({
          error: 'Google login failed. Try again'
        });
      }

    });
};
