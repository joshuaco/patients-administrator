import UI from "./classes/UI.js";
import Appointments from "./classes/Appointments.js";

import {
  $form,
  $phoneInput,
  $petInput,
  $ownerInput,
  $symptomsInput,
  $dateInput,
  $timeInput,
} from "./selectors.js";

import { addToDB, deleteFromDB, editFromDB } from "./db.js";

const petData = {
  mascota: "",
  propietario: "",
  fecha: "",
  hora: "",
  telefono: "",
  sintomas: "",
};

// Instances
const appointment = new Appointments();
const ui = new UI(appointment);

let editing = false;

// Stores the input form data into the object petData
export function dataInput(e) {
  petData[e.target.id] = e.target.value;
}

export function newAppointment(e) {
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

    // Edit in DB
    if (editFromDB({ ...petData })) {
      ui.showAlertMessage("Cita actualizada correctamente", "success");

      // Change text button back
      $form.querySelector("button[type='submit']").textContent = "Crear Cita";

      // Reset editing
      editing = false;
    } else {
      ui.showAlertMessage("Error al actualizar la base de datos", "error");
    }
  } else {
    petData.id = Date.now();

    // Create a new appointment
    appointment.addAppointment({ ...petData }); // Spread operator

    // Add to DB
    addToDB({ ...petData });

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

export function deleteAppointment(id) {
  // Delete appointment in object
  appointment.removeAppointment(id);

  // Delete appointment in DB
  deleteFromDB(id);

  // Delete appointment in the UI
  ui.showAppointments(appointment);

  // Show message
  ui.showAlertMessage("Cita eliminada correctamente", "success");
}

export function editAppointment(appointment) {
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

export function loadAppointments(appointmentsDB) {
  if (appointmentsDB.length > 0) {
    appointmentsDB.forEach((item) => {
      appointment.addAppointment(item);
      console.log(item);
    });

    ui.showAppointments(appointment);
  } else {
    console.log("No hay datos");
    return;
  }

  console.log(appointment);
}
