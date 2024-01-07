import { loadAppointments } from "./functions.js";

let DB;

export function createDB() {
  let request = window.indexedDB.open("appointments", 1);

  request.onerror = () => {
    console.log("Error al crear la base de datos");
  };

  request.onsuccess = () => {
    DB = request.result;
    console.log("Base de datos creada");

    getFromDB();
  };

  // Define Schema
  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    const objectStore = db.createObjectStore("appointments", {
      keyPath: "id",
      autoIncrement: true,
    });

    // Define indexes or columns
    objectStore.createIndex("mascota", "mascota", { unique: false });
    objectStore.createIndex("propietario", "propietario", { unique: false });
    objectStore.createIndex("telefono", "telefono", { unique: false });
    objectStore.createIndex("fecha", "fecha", { unique: false });
    objectStore.createIndex("hora", "hora", { unique: false });
    objectStore.createIndex("sintomas", "sintomas", { unique: false });
    objectStore.createIndex("id", "id", { unique: true });

    console.log("Database created and table is ready");
  };
}

export function addToDB(data) {
  const transaction = DB.transaction(["appointments"], "readwrite");
  const objectStore = transaction.objectStore("appointments");
  objectStore.add(data);

  transaction.oncomplete = () => {
    console.log("Cita agendada");
  };
}

export function editFromDB(data) {
  const transaction = DB.transaction(["appointments"], "readwrite");
  const objectStore = transaction.objectStore("appointments");
  objectStore.put(data);

  transaction.oncomplete = () => {
    console.log("Cita actualizada");
    return true;
  };

  transaction.onerror = () => {
    console.log("Error al actualizar la base de datos");
    return false;
  };
}

export function deleteFromDB(id) {
  const transaction = DB.transaction(["appointments"], "readwrite");
  const objectStore = transaction.objectStore("appointments");
  objectStore.delete(id);

  transaction.oncomplete = () => {
    console.log(`Cita ${id} eliminada`);
  };

  transaction.onerror = () => {
    console.log("Error al eliminar la cita");
  };
}

function getFromDB() {
  const objectStore = DB.transaction(["appointments"]).objectStore(
    "appointments"
  );
  const appointments = [];

  objectStore.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;

    if (cursor) {
      appointments.push(cursor.value);
      cursor.continue();
    } else {
      loadAppointments(appointments);
    }
  };
}
