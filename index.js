const express = require('express');
const betterSqlite3 = require('better-sqlite3');
const {z} = require('zod');

const app = express();
const PORT = 3000;
const db = new betterSqlite3('hospital.db');

app.use('/', express.static('public'));
app.use(express.json());

const patientSchema = z.object(
    {
        id: z.number().positive(),
        patientName: z.string(),
        diagnosis: z.string(),
        address: z.string()
    }
);

const idSchema = z.number().positive();


// patientRecords = [
//     {
//         id: 4525,
//         patientName: "pikachu",
//         diagnosis: "fever",
//         address: "karachi"
//     },
    
//     {
//         id: 24232,
//         patientName: "naruto",
//         diagnosis: "burnt hand",
//         address: "tokyo"
//     },

//     {
//         id: 8023,
//         patientName: "sakura",
//         diagnosis: "headache",
//         address: "pune"
//     },

//     {
//         id: 107203,
//         patientName: "itadori uji",
//         diagnosis: "cough",
//         address: "tokyo"
//     },
// ]


// to get all the patient's records
app.get('/patient/records', (req, res) => {
    console.log("give all patient records");
    
    // fetch for all patient record from database will be here
    const allPatients = db.prepare("SELECT * FROM patients").all();

    res.json(allPatients);
});


// getting single patient record
app.get('/patient/records/:id', (req, res) => {
    const parsedId = idSchema.safeParse( parseInt( req.params.id ) );
    console.log(parsedId);
    if ( parsedId.success ) {

        // one patient record fetch from database will happen here
        const patient = db.prepare('SELECT * FROM patients WHERE id = ?').all(parsedId.data);

        res.json(patient[0]);
    } else {
        res.status(404).json({message: "invalid patient id"});
    }
});

// adding a new patient record
app.post('/patient/records', (req, res) => {
    const patientName = req.body.patientName;
    const diagnosis = req.body.diagnosis;
    const address = req.body.address;

    console.table([patientName, diagnosis, address]);
    
    // we put patient record into database here
    const putNewPatient = db.prepare('INSERT INTO patients(name, diagnosis, address) VALUEs( ?, ?, ? )').run(patientName, diagnosis, address);

    res.json({message: "one patient record added!!", putNewPatient});
});

// deleting patient's record
app.delete('/patient/records/:id', (req, res) => {
    const parsedId = idSchema.safeParse(parseInt(req.params.id));

    if (parsedId.success) {
        // delete from database
        const result = db.prepare("DELETE FROM patients WHERE id = ?").run(parsedId.data);
        res.json({message: "patient record deleted", result});
    } else {
        res.status(404).json({message: "invalid patient Id"});
    }
});

// update patient's record
app.put('/patient/records/:id', (req, res) => {
    const parsedId = idSchema.safeParse(parseInt(req.params.id));

    if ( parsedId.success ) {
        const id = parsedId.data;
        const patient = req.body;

        console.log(patient);

        if ( 'name' in patient ) {
            // update patient's name
            db.prepare("UPDATE patients SET name = ? WHERE id = ?").run(patient.name, id);
        }
        
        if ( 'diagnosis' in patient ) {
            // update patient's dia
            db.prepare("UPDATE patients SET diagnosis = ? WHERE id = ?").run(patient.diagnosis, id);
        }
        
        if ( 'address' in patient ) {
            // update address
            db.prepare("UPDATE patients SET address = ? WHERE id = ?").run(patient.address, id);
        }

        res.json({message: "patient's record updated", updatedPatient: req.body});
    } else {
        res.status(404).json({message: "invalid patient Id"});
    }
});

app.use((req, res) => {
    res.status(404).json({message: "page not found"});
});

async function main() {
    app.listen(PORT, () => {
        console.log('Patient Record Server');
        console.log(`Server running at http://127.0.0.1:${PORT}`);
    })
}

main().catch(err => console.log(err));


// TODO
// fetch all records - GET
// fetch one record - GET route parameter
// add a record - POST
// delete a record - DELETE
// update a record - PUT