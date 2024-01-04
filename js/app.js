// Input Form Selectors
const $petInput = document.querySelector("#mascota");
const $ownerInput = document.querySelector("#propietario");
const $dateInput = document.querySelector("#fecha");
const $timeInput = document.querySelector("#hora");
const $phoneInput = document.querySelector("#telefono");
const $symptomsInput = document.querySelector("#sintomas");

// UI Selectors
const $form = document.querySelector("#nueva-cita");
const $appointments = document.querySelector("#citas");

let editing = false;

// Appointments Object
const petData = {
  mascota: "",
  propietario: "",
  fecha: "",
  hora: "",
  telefono: "",
  sintomas: "",
};

// Classes
class Appointments {
  constructor() {
    this.appointments = [];
  }

  addAppointment(appointment) {
    this.appointments = [...this.appointments, appointment];
  }

  removeAppointment(id) {
    this.appointments = this.appointments.filter(
      (appointment) => appointment.id !== id
    );
  }

  editAppointment(updatedAppointment) {
    this.appointments = this.appointments.map((appointment) =>
      appointment.id === updatedAppointment.id
        ? updatedAppointment
        : appointment
    );
  }
}

class UI {
  showAlertMessage(message, type) {
    const $alert = document.createElement("div");
    $alert.classList.add("alert", "text-center", "col-12", "d-block");

    if (type === "error") {
      $alert.classList.add("alert-danger");
    } else {
      $alert.classList.add("alert-success");
    }

    $alert.textContent = message;

    // Insert into DOM
    document
      .querySelector("#contenido")
      .insertBefore($alert, document.querySelector(".agregar-cita"));

    // Remove alert after 4 seconds
    setTimeout(() => {
      $alert.remove();
    }, 4000);
  }

  showAppointments({ appointments }) {
    this.cleanHTML();
    appointments.forEach((appointment) => {
      const { mascota, propietario, telefono, fecha, hora, sintomas, id } =
        appointment;

      // Appointment container
      const $appointmentDiv = document.createElement("div");
      $appointmentDiv.classList.add("cita", "p-3");
      $appointmentDiv.dataset.id = id;

      // Data form elements
      const $petName = document.createElement("h2");
      $petName.classList.add("card-title", "font-weight-bolder");
      $petName.textContent = mascota;

      const $ownerName = document.createElement("p");
      $ownerName.innerHTML = `
        <span class="font-weight-bolder">Propietario:</span> ${propietario}
      `;

      const $phone = document.createElement("p");
      $phone.innerHTML = `
        <span class="font-weight-bolder">Teléfono:</span> ${telefono}
      `;

      const $date = document.createElement("p");
      $date.innerHTML = `
        <span class="font-weight-bolder">Fecha:</span> ${fecha}
      `;

      const $time = document.createElement("p");
      $time.innerHTML = `
        <span class="font-weight-bolder">Hora:</span> ${hora}
      `;

      const $symptoms = document.createElement("p");
      $symptoms.innerHTML = `
        <span class="font-weight-bolder">Síntomas:</span> ${sintomas}
      `;

      // Button delete appointment
      const $btnDelete = document.createElement("button");
      $btnDelete.classList.add("btn", "btn-danger", "mr-2");
      $btnDelete.innerHTML = `Eliminar Cita`;
      $btnDelete.onclick = () => deleteAppointment(id);

      // Button edit appointment
      const $btnEdit = document.createElement("button");
      $btnEdit.classList.add("btn", "btn-info");
      $btnEdit.innerHTML = "Editar Cita";
      $btnEdit.onclick = () => editAppointment(appointment);

      $appointmentDiv.appendChild($petName);
      $appointmentDiv.appendChild($ownerName);
      $appointmentDiv.appendChild($phone);
      $appointmentDiv.appendChild($date);
      $appointmentDiv.appendChild($time);
      $appointmentDiv.appendChild($symptoms);
      $appointmentDiv.appendChild($btnDelete);
      $appointmentDiv.appendChild($btnEdit);

      // Append in the ul parent element
      $appointments.appendChild($appointmentDiv);
    });
  }

  cleanHTML() {
    while ($appointments.firstChild) {
      $appointments.removeChild($appointments.firstChild);
    }
  }
}

// Event Listeners
eventListeners();
function eventListeners() {
  $petInput.addEventListener("input", dataInput);
  $ownerInput.addEventListener("input", dataInput);
  $phoneInput.addEventListener("input", dataInput);
  $dateInput.addEventListener("change", dataInput);
  $timeInput.addEventListener("change", dataInput);
  $symptomsInput.addEventListener("input", dataInput);

  $form.addEventListener("submit", newAppointment);
}

// Instances
const appointment = new Appointments();
const ui = new UI();

// Functions
// Stores the input form data into the object petData
function dataInput(e) {
  petData[e.target.id] = e.target.value;
}

function newAppointment(e) {
  e.preventDefault();

  const { mascota, propietario, fecha, hora, telefono, sintomas } = petData;

  if (
    mascota === "" ||
    propietario === "" ||
    fecha === "" ||
    telefono === "" ||
    hora === "" ||
    sintomas === ""
  ) {
    ui.showAlertMessage("Todos los campos son obligatorios", "error");
    return;
  }

  if (editing) {
    // Edit object
    appointment.editAppointment({ ...petData });

    // Show success message
    ui.showAlertMessage("Cita actualizada correctamente", "success");

    // Change text button back
    $form.querySelector("button[type='submit']").textContent = "Crear Cita";

    // Reset editing
    editing = false;
  } else {
    petData.id = Date.now();

    // Create a new appointment
    appointment.addAppointment({ ...petData }); // Spread operator

    // Show success message
    ui.showAlertMessage("Cita agendada correctamente", "success");
  }

  // Reset form and object
  $form.reset();
  resetObjectData();

  // Show appointments on UI
  ui.showAppointments(appointment);
}

function resetObjectData() {
  petData.mascota = "";
  petData.propietario = "";
  petData.telefono = "";
  petData.fecha = "";
  petData.hora = "";
  petData.sintomas = "";
}

function deleteAppointment(id) {
  // Delete appointment in object
  appointment.removeAppointment(id);

  // Delete appointment in the UI
  ui.showAppointments(appointment);

  // Show message
  ui.showAlertMessage("Cita eliminada correctamente", "success");
}

function editAppointment(appointment) {
  const { mascota, propietario, fecha, hora, telefono, sintomas, id } =
    appointment;

  // Show the values in the input
  $petInput.value = mascota;
  $ownerInput.value = propietario;
  $dateInput.value = fecha;
  $timeInput.value = hora;
  $phoneInput.value = telefono;
  $symptomsInput.value = sintomas;

  // Retrieve data in object
  petData.mascota = mascota;
  petData.propietario = propietario;
  petData.telefono = telefono;
  petData.fecha = fecha;
  petData.hora = hora;
  petData.sintomas = sintomas;
  petData.id = id;

  editing = true;

  // Change the text of the button
  $form.querySelector("button[type='submit']").textContent = "Guardar Cambios";
}
