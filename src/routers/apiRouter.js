const express = require("express");
const {
    handleGetPatients,
    handleGetPatientById,
    handleCreatePatient,
    handleDeletePatient,
    handleUpdatePatient,
} = require("../controllers/patients");

const apiRouter = express.Router();

// to get all the patient's records
apiRouter.get("/patients", handleGetPatients);

// getting single patient record
apiRouter.get("/patients/:id", handleGetPatientById);

// adding a new patient record
apiRouter.post("/patients", handleCreatePatient);

// update patient's record
apiRouter.put("/patients/:id", handleUpdatePatient);

// deleting patient's record
apiRouter.delete("/patients/:id", handleDeletePatient);

module.exports = apiRouter;
