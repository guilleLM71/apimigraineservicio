import Pacient from "../model/pacient";
import User from "../model/user";
import Role from "../model/role";
import { model } from "mongoose";
export const createpaciente = async (req, res) => {
  try {
    const { ci, nombre, sintomas,diagnostico } = req.body;
    console.log(req.body)
   
    // creating a new User
    const pacient = new Pacient({
      ci,
      nombre,   
      sintomas,
      diagnostico:"Sin Diagnostico",
    
    });
    

    pacient.iddoc = req.userId;
    // saving the new user
    console.log(pacient)
    const saved = await pacient.save();

    return res.status(200).json({
      _id: saved._id,
      nombre: saved.nombre,
      ci: saved.ci,      
      sintomas:saved.sintomas,
      diagnostico:saved.diagnostico,
      iddoc:saved.iddoc
    });
  } catch (error) {
    console.error(error);
    
  }
};

export const getpaciente = async (req, res) => {

  const { userId } = req.params;

  const paciente = await Pacient.findById(userId);
  res.status(200).json(paciente);
};


export const getpacientes = async (req, res) => {

  const { iddoc } = req.body;
  console.log(req.body)

  try {
  const pacientes = await Pacient.find({iddoc: iddoc })
    .sort({ date: "desc" })
    .lean();
  

    return res.status(200).json({
      pacientes: pacientes,
      
    });
  } catch (error) {
    console.error(error);
    
  }
};

export const updatediagnosticopac = async (req, res) => {
  console.log(req.params.userId)
  const updatedPacient = await Pacient.findByIdAndUpdate(
    req.params.userId,
   
    req.body,
    {
      new: true,
    
    }
    
  );
  const title= 'Update Dignostico Successfully.'
  res.status(204).json(updatedPacient
                        );



};

export const editarpaciente =async(req, res) => {
  try {
    if (req.body) {

      Pacient.findById(req.body._id, (err, new_paciente) => {

        if (req.body.ci) {
          new_paciente.ci = req.body.ci;
        }
        if (req.body.nombre) {
          new_paciente.nombre = req.body.nombre;
        }
        if (req.body.nombre) {
          new_paciente.diagnostico = req.body.diagnostico;
        }
      
        new_paciente.save((err, data) => {
          if (err) {
            res.status(400).json({
              errorMessage: err,
              status: false
            });
          } else {
            res.status(200).json({
              status: true,
              title: 'paciente actualizado.'
            });
          }
        });

      });

    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
};

export const borrarpaciente =async (req, res) => {
  try {
    if (req.params) {
      await Pacient.findByIdAndRemove(req.params.userId);
      res.json({status: 'Paciente eliminado'});
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
};



