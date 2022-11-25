import { Router } from "express";
const router = Router();

import * as pacientCtrl from "../controllers/paciente.controller";
import { authJwt, verifySignup } from "../middlewares";


router.post("/doctor",

  [
    authJwt.verifyToken,
    authJwt.isDoctor
  ],
  pacientCtrl.createpaciente,
  );
  
  router.post("/pacientes",

  [
    authJwt.verifyToken,
    authJwt.isDoctor
  ],
  pacientCtrl.getpacientes,
  );
  router.put("/pacientes/:userId",
  [

    authJwt.verifyToken,
    authJwt.isDoctor,
    verifySignup.checkDuplicateUsernameOrEmail,
  ],
  pacientCtrl.updatediagnosticopac,
  //usersCtrl.updatesintomas,
  
);



router.get("/paciente/:userId",

  [
    authJwt.verifyToken,
    authJwt.isDoctor
  ],
  pacientCtrl.getpaciente,
);

 router.put("/paciente/:userId",
  [

    authJwt.verifyToken,
    authJwt.isDoctor,
    verifySignup.checkDuplicateUsernameOrEmail,
  ],
  pacientCtrl.editarpaciente,
  //usersCtrl.updatesintomas,
  
);

router.delete("/paciente/:userId",
[

  authJwt.verifyToken,
  authJwt.isDoctor,
  verifySignup.checkDuplicateUsernameOrEmail,
],
pacientCtrl.borrarpaciente,
//usersCtrl.updatesintomas,
)


export default router;
