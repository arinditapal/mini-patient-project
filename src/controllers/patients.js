const { z } = require("zod");
const {
    idSchema,
    patientSchema,
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatientName,
    updatePatientDiagnosis,
    updatePatientAddress,
    deletePatient,
} = require("../models/patients");

const createPatientSchema = patientSchema.pick({
    name: true,
    diagnosis: true,
    address: true,
});

/**
 * Get patients handler
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
function handleGetPatients(req, res) {
    console.log("> controller: give all patient records");

    // get all patients
    const patients = getAllPatients();

    res.json(patients);
}

/**
 * Get patient by id handler
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
function handleGetPatientById(req, res) {
    const parsedId = idSchema.safeParse(parseInt(req.params["string"]));
    console.log(parsedId);
    if (parsedId.success) {
        const id = parsedId.data;
        const patient = getPatientById(id);

        res.json(patient);
    } else {
        res.status(404).json({ message: "invalid patient id" });
    }
}

/**
 * Create new patient handler
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
function handleCreatePatient(req, res) {
    const newPatient = createPatientSchema.parse(req.body);

    console.log("> controller: newPatient to be addedd is ", newPatient);

    createPatient(newPatient.name, newPatient.diagnosis, newPatient.address);

    res.json({ message: "new patient added" });
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
function handleUpdatePatient(req, res) {
    const parsedId = idSchema.safeParse(parseInt(req.params.id));

    if (parsedId.success) {
        const id = parsedId.data;
        const patient = req.body;

        console.log(patient);

        if ("name" in patient) {
            updatePatientName(id, patient.name);
        }

        if ("diagnosis" in patient) {
            updatePatientDiagnosis(id, patient.diagnosis);
        }

        if ("address" in patient) {
            updatePatientAddress(id, patient.address);
        }

        res.json({
            message: "patient updated",
            updatedPatient: req.body,
        });
    } else {
        res.status(404).json({ message: "invalid patient Id" });
    }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
function handleDeletePatient(req, res) {
    const parsedId = idSchema.safeParse(parseInt(req.params.id));

    if (parsedId.success) {
        const id = parsedId.data;

        deletePatient(id);

        res.json({ message: "patient deleted" });
    } else {
        res.status(404).json({ message: "invalid patient Id" });
    }
}

module.exports = {
    createPatientSchema,
    handleGetPatients,
    handleGetPatientById,
    handleCreatePatient,
    handleUpdatePatient,
    handleDeletePatient,
};
