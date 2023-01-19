const { printTable, Table } = require("console-table-printer");
const chalk = require("chalk");

function setBorderColor(table, color) {
  const ts = table.table.tableStyle;
  Object.keys(ts).forEach((key) => {
    const style = ts[key];
    if (typeof style !== "object") {
      ts[key] = chalk[color](style);
    } else
      Object.keys(style).forEach((key) => {
        style[key] = chalk[color](style[key]);
      });
  });
}

function printAsTable(list, title) {
  if (!list || list.length === 0) return;
  const table = new Table({
    columns: [
      ...Object.keys(list[0]).map((key) => ({ name: key, alignment: "left" })),
    ],
    title
  });
  table.table.columns[0].alignment = "right";
  table.table.columns[0].color = "gray";
  setBorderColor(table, "blackBright");
  table.addRows(list, { color: "green" });
  table.printTable();
}

module.exports = {
  printAsTable,
};
