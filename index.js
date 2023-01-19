const contacts = require("./contacts");
const chalk = require("chalk");
const { Command } = require("commander");

const program = new Command();
program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse(process.argv);

const argv = program.opts();

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      contacts.listContacts();
      break;

    case "get":
      contacts.getContactById(id);
      break;

    case "add":
      contacts.addContact(name, email, phone);
      break;

    case "remove":
      contacts.removeContact(id);
      break;

    default:
      console.warn(chalk.red("Unknown action type!"));
  }
}

invokeAction(argv);

// async function test() {
//   await contacts.listContacts();
//   await contacts.getContactById(5);
//   await contacts.getContactById(22);
//   await contacts.removeContact(4);
//   await contacts.addContact("Eugene", "some1@email.ua", "(067) 621-6636");
//   await contacts.removeContact(11);
//   await contacts.removeContact(44);
// }

// test();
