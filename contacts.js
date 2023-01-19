const fs = require("fs").promises;
const path = require("path");
const { printAsTable } = require("./myTable");
const chalk = require("chalk");

const contactsPath = path.resolve("./", "db", "contacts.json");

/**
 * Asynchronously outputs contacts, contained by array in contacts.json.
 * in console.table form (with some cosmetic tweaks).
 */
function listContacts() {
  return loadContacts()
    .then((contacts) => {
      printAsTable(contacts, text.listTitle);
    })
    .catch(logError);
}

/**
 * Asynchronously outputs a single contact from array in contacts.json by given id.
 * @param {!number} contactId - id of the contact to look for
 */
function getContactById(contactId) {
  return loadContacts()
    .then((contacts) => {
      const contact = findById(contacts, contactId);
      if (contact) printAsTable([contact], text.contactTitle(contactId));
      else throw text.nothingFound(contactId);
    })
    .catch(logError);
}

/**
 * Asynchronously removes a single contact from array in contacts.json by given id.
 * @param {!number} contactId - id of the contact to remove
 */
function removeContact(contactId) {
  return loadContacts()
    .then((contacts) => {
      if (!findById(contacts, contactId)) {
        throw text.unableToRemove(contactId);
      }
      contacts = contacts.filter((contact) => contact.id !== contactId);
      saveContacts(contacts).then(() => {
        console.log(text.removeSuccess(contactId));
      });
    })
    .catch(logError);
}

/**
 * Asynchronously adds a single contact to array in contacts.json by given personal data.
 * Checks for existing contact with the same name before addition.
 * The contact id is picked from the lowest available.
 * @param {string} name - the name of the person
 * @param {string} email - the email of the person
 * @param {string} phone - the phone number of the person
 */
function addContact(name, email, phone) {
  return loadContacts()
    .then((contacts) => {
      const id = findNextEmptyId(contacts);
      const contact = { id, name, email, phone };

      if (isContactExist(contacts, contact)) {
        throw text.unableToAdd(name);
      }

      contacts.push(contact);
      contacts.sort((a, b) => a.id - b.id);

      saveContacts(contacts).then(() => {
        console.log(text.addSuccess(id));
      });
    })
    .catch(logError);
}

/**  ------------------------- HELPERS ----------------------------- */

/** Checks if contact exist */
function isContactExist(contacts, contact) {
  // Remove extra space characters and uniform the case
  const name = contact.name.trim().replace(/\s+/g, " ").toLowerCase();
  return contacts.some((contact) => contact.name.toLowerCase() === name);
}

/** Convers raw string to array of contacts. The id key would be converted to Number */
function parseRawData(data) {
  return JSON.parse(data, (key, value) =>
    key === "id" ? Number(value) : value
  );
}

/** Loads contacts from file */
function loadContacts(path = contactsPath) {
  return fs.readFile(path, { encoding: "utf-8" }).then(parseRawData);
}

/** Saves contacts to file */
function saveContacts(contacts, path = contactsPath) {
  data = JSON.stringify(contacts, null, 2);
  return fs.writeFile(path, data);
}

/** Tests if provided id is a positive integer */
function validateId(id) {
  return /^\d+$/.test(id);
}

/** Finds contact by id */
function findById(contacts, id) {
  if (!validateId(id)) throw text.idParseError(id);
  id = +id;
  return contacts.find((contact) => contact.id === id);
}

/** Calculates the first empty id value */
function findNextEmptyId(contacts) {
  let id = 1;
  for (const contact of contacts) {
    if (id < contact.id) return id;
    id = contact.id + 1;
  }
  return id;
}

/** Logs out the error message */
function logError(msg) {
  console.error(chalk.red(msg));
}

/** Package ouptut messages */
const text = {
  listTitle: "List of contacts",
  contactTitle: (id) => `Contact with id=${id}`,
  nothingFound: (id) => `There is no contact found with id=${id}.`,
  unableToRemove: (id) =>
    `Unable to remove the contact with id=${id}. There is no such contact.`,
  removeSuccess: (id) => `Contact with id=${id} was succesfully removed.`,
  unableToAdd: (name) =>
    `Unable to add a contact for person with the name "${name}". It is already in the list.`,
  addSuccess: (id) => `A new contact with id=${id} was succesfully added.`,
  idParseError: (id) =>
    `The id parameter must be a positive integer. Provided value is "${id}".`,
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
