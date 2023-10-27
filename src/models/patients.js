const { z } = require("zod");
const betterSqlite3 = require("better-sqlite3");

const db = new betterSqlite3("hospital.db");

const patientSchema = z.object({
    id: z.number().positive(),
    name: z.string(),
    diagnosis: z.string().nullable(),
    address: z.string(),
});

const patientArraySchema = z.array(patientSchema);

const idSchema = patientSchema.shape.id;

/**
 * Defining Patient Schema
 * @typedef {z.infer<typeof patientSchema>} Patient
 */

/**
 * Get all Patients
 * @returns {Patient[]}
 */
function getAllPatients() {
    console.log("> model: in all patient");
    const data = db.prepare("SELECT * FROM patients").all();
    console.log("data", data);
    const patients = patientArraySchema.parse(data);

    return patients;
}

/**
 * Get patient by id
 * @param {Patient["id"]} id - id of the patient
 * @returns {Patient}
 */
function getPatientById(id) {
    const data = db
            .prepare("SELECT * FROM patients WHERE id = ?")
            .all(id);

;
    const patient = patientSchema.parse(data[0]);

    console.log(patient);
    return patient;
}

/**
 * 
 * @param {Patient["name"]} name 
 * @param {Patient["diagnosis"]} diagnosis 
 * @param {Patient["address"]} address 
 */
function createPatient(name, diagnosis, address) {
    console.log("> model: in create patient");
    const data = db.prepare("INSERT INTO patients(name, diagnosis, address) values(?, ?, ?)").run(name, diagnosis, address);

}

/**
 * 
 * @param {Patient["id"]} id 
 * @param {Patient["name"]} newName 
 */
function updatePatientName(id, newName) {

    const data = db.prepare("UPDATE patients SET name = ? WHERE id = ?").run(newName, id);
}

/**
 * 
 * @param {Patient["id"]} id 
 * @param {Patient["diagnosis"]} newDiagnosis 
 */
function updatePatientDiagnosis(id, newDiagnosis) {

    const data = db.prepare("UPDATE patients SET diagnosis = ? WHERE id = ?").run(newDiagnosis, id);
}

/**
 * 
 * @param {Patient["id"]} id 
 * @param {Patient["address"]} newAddress 
 */
function updatePatientAddress(id, newAddress) {

    const data = db.prepare("UPDATE patients SET address = ? WHERE id = ?").run(newAddress, id);
}

/**
 * 
 * @param {Patient["id"]} id 
 */
function deletePatient(id) {
    const data = db.prepare("DELETE FROM patients WHERE id = ?").run(id);
}

module.exports = {
    idSchema,
    patientSchema,
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatientName,
    updatePatientDiagnosis,
    updatePatientAddress,
    deletePatient,
};
