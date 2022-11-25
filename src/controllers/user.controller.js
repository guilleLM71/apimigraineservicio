import User from "../model/user";
import Role from "../model/role";
import Pacient from "../model/pacient";
import Sintomas from "../model/sintomas";
import { model } from "mongoose";
import sintomas from "../model/sintomas";


export const createUser = async (req, res) => {
  try {
    const { username, email, password, roles,sintomas,diagnostico } = req.body;
    console.log(req.body)
    const rolesFound = await Role.find({ name: { $in: roles } });

    // creating a new User
    const user = new User({
      username,
      email,
      password,
      roles: rolesFound.map((role) => role._id),
      sintomas,
      diagnostico:"Sin Diagnostico",
    
    });
    console.log(user)

    // encrypting password
    user.password = await User.encryptPassword(user.password);

    // saving the new user
    const savedUser = await user.save();

    return res.status(200).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      roles: savedUser.roles,
      sintomas:savedUser.sintomas,
      diagnostico:savedUser.diagnostico,
    });
  } catch (error) {
    console.error(error);
    
  }
};



export const getUsers = async (req, res) => { 
  const users = await User.find();
  return res.json(users);
};

export const getuserbyid = async (req, res) => {
  
  const { userId } = req.params;

  const user = await User.findById(userId);
  res.status(200).json(user);

};


export const updatediagnostico = async (req, res) => {

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      {
        new: true,
      
      }
    );
    const title= 'Update Dignostico Successfully.'
    res.status(204).json(updatedUser
                          );

  

};

export const updatesintomas=async (req, res) => {
  

  const updatedUser = await User.findByIdAndUpdate(
    req.params.userId,
    req.body,
    {
      new: true,
   
    }
  );
  const title='Update Sintomas Successfully.'
  res.status(204).json(updatedUser
    );

};

