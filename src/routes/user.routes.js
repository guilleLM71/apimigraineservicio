import { Router } from "express";
const router = Router();

import * as usersCtrl from "../controllers/user.controller";
import { authJwt, verifySignup } from "../middlewares";

router.post( "/admin",
  [
    authJwt.verifyToken,
    authJwt.isAdmin,
    verifySignup.checkDuplicateUsernameOrEmail,
  ],
  usersCtrl.createUser
);


router.get(  "/admin",
  [
    authJwt.verifyToken,
    authJwt.isAdmin,
    verifySignup.checkDuplicateUsernameOrEmail,
  ],
  usersCtrl.getUsers
);

router.get("/:userId", 
usersCtrl.getuserbyid
);

router.put("/:userId",
  [
    authJwt.verifyToken,
    verifySignup.checkDuplicateUsernameOrEmail,
  ],
  usersCtrl.updatediagnostico,
  //usersCtrl.updatesintomas,
  
);


export default router;
