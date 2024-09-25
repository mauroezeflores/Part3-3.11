const repl = require("node:repl");
const express = require("express");
const app = express();
require("dotenv").config(); //Para utilizar las variables de entorno definidas en .env
const Note = require("./models/person");

let phonebook = [];

const cors = require("cors");

app.use(cors());
app.use(express.static("dist"));

const responseTime = require("response-time");
const morgan = require("morgan");

morgan.token("content", function (request, response) {
  return JSON.stringify(request.body);
});

app.use(express.json());
app.use(responseTime());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
);

app.get("/", (request, response) => {
  response.send("<h1>Phonebook backend exercise</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    //find parameter void {}, trae todos los objetos de la coleccion persons
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id); //Ya que params.id devuelve el string
  //console.log(id);
  const person = phonebook.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    //si person === falsy - undefined
    response.status(404).end();
  }
});

const phonebookSize = () => {
  return phonebook.length;
};

app.get("/info", (request, response) => {
  const currentTime = new Date();
  const totalPersons = phonebookSize();

  response.send(
    `<p>Phonebook has info for ${totalPersons} people</p><p>${currentTime}</p>`
  );
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id); //Ya que params.id devuelve el string

  phonebook = phonebook.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateID = () => {
  //Random ID exercise 3.5
  min = Math.ceil(10);
  max = Math.floor(99999999);
  return Math.floor(Math.random() * (max - min) + min);
};

const personAlreadyExist = (reqName) => {
  return phonebook.find((p) => p.name === reqName);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "person name missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "person number missing",
    });
  }

  if (personAlreadyExist(body.name)) {
    return response.status(409).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateID(),
    name: body.name,
    number: body.number,
  };

  phonebook = phonebook.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
