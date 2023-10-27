console.log("> frontend: Patient app start");

const patientForm = document.querySelector(".patientForm");
const patientList = document.querySelector(".patientList");

/**
 * Defining Patient type
 * @typedef {{id: number, name: string, diagnosis: string | null, address: string}} Patient
 */

async function handlePatientPrint() {
    if(!patientList) return;

    patientList.innerHTML = `<li class="patientItem" style="font-weight: bold;">
        <div>Name</div>
        <div>Diagnosis</div>
        <div>Address</div>
    </li>`
    
    /** @type {Patient[]} */
    const patients = await fetch("/api/patients").then(res => res.json());

    console.log(patients);


    patients.forEach(patient => {
        const patientRecord = document.createElement('li');
        const patientName = document.createElement('div');
        const patientDiagnosis = document.createElement('div');
        const patientAddress = document.createElement('address');
        const patientDeleteButton = document.createElement('button');

        patientName.textContent = patient.name;
        patientDiagnosis.textContent = patient.diagnosis;
        patientAddress.textContent = patient.address;
        patientDeleteButton.textContent = '❌';
        
        patientDeleteButton.style.cursor = "pointer";
        patientDeleteButton.style.backgroundColor = "none";
        patientDeleteButton.style.border = "none";

        patientDeleteButton.addEventListener("click", () => {
            fetch(`/api/patients/${patient.id}`, {
                method: "DELETE"
            })
              .then(res => handlePatientPrint())
              .catch(err => console.log(err));
        })
        
        patientRecord.appendChild(patientName);
        patientRecord.appendChild(patientDiagnosis);
        patientRecord.appendChild(patientAddress);
        patientRecord.appendChild(patientDeleteButton);
        patientRecord.classList.add("patientItem");

        patientList?.appendChild(patientRecord);
    })
}


handlePatientPrint()

if (patientForm) {
    patientForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const newPatientData = {
            name: patientForm.name.value,
            diagnosis: patientForm.diagnosis.value,
            address: patientForm.address.value
        }

        console.log(newPatientData);

        fetch("/api/patients", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newPatientData)

        })
            .then(res => handlePatientPrint())
            .catch(err => console.log(err.message));

    });
}