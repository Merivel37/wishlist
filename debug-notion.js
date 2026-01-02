const { Client } = require("@notionhq/client");
const notion = new Client({ auth: "secret_test" });
console.log("Notion Client Keys:", Object.keys(notion));
console.log("notion.databases:", notion.databases);
if (notion.databases) {
  console.log("notion.databases keys:", Object.keys(notion.databases));
}
