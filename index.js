const express = require('express');
const betterSqlite3 = require('better-sqlite3');
const {z, ZodParsedType} = require('zod');

const app = express();
const PORT = 3000;
const db = betterSqlite3('sqlite.db');

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


// TODO
// fetch all records - GET
// fetch one record - GET route parameter
// add a record - POST
// delete a record - DELETE
// update a record - PUT

patientRecords = [
    {
        id: 4525,
        patientName: "pikachu",
        diagnosis: "fever",
        address: "karachi"
    },
    
    {
        id: 24232,
        patientName: "naruto",
        diagnosis: "burnt hand",
        address: "tokyo"
    },

    {
        id: 8023,
        patientName: "sakura",
        diagnosis: "headache",
        address: "pune"
    },

    {
        id: 107203,
        patientName: "itadori uji",
        diagnosis: "cough",
        address: "tokyo"
    },
]


// to get all the records
app.get('/patient/records', (req, res) => {
    console.log("give all patient records");
    
    // fetch for all patient record from database will be here

    res.json(patientRecords);
});


// getting single patient record
app.get('/patient/records/:id', (req, res) => {
    const parsedId = idSchema.safeParse( parseInt( req.params.id ) );
    if ( parsedId.success ) {

        // one patient record fetch from database will happen here

        let requiredPatient = null;

        patientRecords.forEach(patient => {
            if (patient.id === parsedId.data) {
                requiredPatient = patient;
            }
        });
        if (requiredPatient !== null) {
            res.json(requiredPatient);
        } else {
            res.status(404).json({message: "patient id does not exist!!"})
        }

    } else {
        res.status(404).json({message: "invalid patient id"});
    }
});

// adding a patient record to database
app.post('/patient/records', (req, res) => {
    const patientName = req.body.patientName;
    const diagnosis = req.body.diagnosis;
    const address = req.body.address;

    console.table([patientName, diagnosis, address]);
    
    // we put patient record into database here

    patientRecords.push(req.body);
    console.log(patientRecords);

    res.json({message: "one patient record added!!"});
})

async function main() {
    app.listen(PORT, () => {
        console.log('Patient Record Server');
        console.log(`Server running at http://127.0.0.1:${PORT}`);
    })
}

main().catch(err => console.log(err));