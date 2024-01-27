import { createDB } from "./db.js";
import { dataInput, newAppointment } from "./functions.js";
import {
  $petInput,
  $ownerInput,
  $form,
  $phoneInput,
  $symptomsInput,
  $dateInput,
  $timeInput,
} from "./selectors.js";

window.onload = () => {
  eventListeners();
  createDB();
};

function eventListeners() {
  $petInput.addEventListener("input", dataInput);
  $ownerInput.addEventListener("input", dataInput);
  $phoneInput.addEventListener("input", dataInput);
  $dateInput.addEventListener("change", dataInput);
  $timeInput.addEventListener("change", dataInput);
  $symptomsInput.addEventListener("input", dataInput);

  $form.addEventListener("submit", newAppointment);
}
