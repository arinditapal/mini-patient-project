const patientList = document.querySelector('.patientList');

async function printPatients () {
    patientList.innerHTML = '';

    const patients = await fetch( 'http://localhost:3000/api/patients/' ).then(res => res.json());
    

    patients.forEach( patient => {
        console.log(patient);

        let patientRecord = document.createElement('li');
        let name = document.createElement('span');
        let diagnosis = document.createElement('div');
        let address = document.createElement('address');
        let button = document.createElement('button');

        name.textContent = patient.name;
        diagnosis.textContent = patient.diagnosis;
        address.textContent = patient.address;

        // console.table([name.textContent, diagnosis.textContent, address.textContent]);

        button.addEventListener('click', () => {
            const url = `/api/patients/${patient.id}`;
            fetch( url, {
                method: 'DELETE'
            } )
                .then(res => printPatients())
                .catch(err => console.log(err.message));
        });

        patientRecord.appendChild(name);
        patientRecord.appendChild(diagnosis);
        patientRecord.appendChild(address);
        patientRecord.appendChild(button);

        patientList.appendChild(patientRecord);

    });
};

printPatients();