import http from "node:http";
import mysql from "mysql2/promise";
import { faker } from "@faker-js/faker";

const hostname = "0.0.0.0";
const port = 3000;

const connection = await mysql.createConnection({
  host: "fullcycle-mysql",
  user: "root",
  password: "root",
  database: "fullcycle",
});

const server = http.createServer(async (req, res) => {
  connection.connect();

  let response = `
    <h1>Fullcycle Rocks!</h1>
    <h3>People:</h3>
    <ul>
  `;

  try {
    const name = faker.person.fullName();

    await connection.query(
      `INSERT INTO people (name) VALUES ('${name.replace(/'/g, "\\'")}')`
    );

    console.log(`Person name ${name} inserted!`);
  } catch (error) {
    console.error("Error:", error);
  }

  try {
    const [results] = await connection.query("SELECT * FROM people");

    results.forEach((person) => (response += `<li>${person.name}</li>`));
  } catch (error) {
    console.error("Error:", error);
  }

  response += "</ul>";

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end(response);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
