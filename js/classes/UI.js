import { deleteAppointment, editAppointment } from "../functions.js";

const $appointments = document.querySelector("#citas");
const $header = document.querySelector("#administra");

class UI {
  constructor({ appointments }) {
    this.changeHeaderText(appointments);
  }
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
    this.changeHeaderText(appointments);

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

  changeHeaderText(appointments) {
    if (appointments.length > 0) {
      $header.textContent = "Administra tus Citas";
    } else {
      $header.textContent = "No hay Citas, comienza creando una";
    }
  }

  cleanHTML() {
    while ($appointments.firstChild) {
      $appointments.removeChild($appointments.firstChild);
    }
  }
}

export default UI;
