const repl = require("node:repl");
const express = require("express");
const app = express();
require("dotenv").config(); //Para utilizar las variables de entorno definidas en .env
const Person = require("./models/person");

const cors = require("cors");

app.use(express.static("dist"));
app.use(cors());


const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    //if the promise is rejected 
    //400 Bad Request description matchs client error from an ID
    //Checks if the error is caused by an invalid ID for mongoDB
    return response.status(400).send({ error: "malformatted id" });
  }else if (error.name === "ValidationError") {
    //if mongoose validation fails 
    return response.status(400).json({error: error.message});
  }
  next(error);
}
const responseTime = require("response-time");
const morgan = require("morgan");
const person = require("./models/person");
const { error } = require("node:console");

morgan.token("content", function (request, response) {
  return JSON.stringify(request.body);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(express.json());
app.use(responseTime());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
);

//Get all persons from mongoDB
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    //find parameter void {}, get all objets from persons collection
    response.json(persons);
  });
});

//Get person by ID from mongoDB
app.get("/api/persons/:id", (request, response, next) => {

  const { id } = request.params;
  
  Person.findById(id)
  . then((person) => {
      if(person){
        response.json(person);
      } else {
        response.status(404).end();
      }
  })
  .catch(error => next(error));
});

//Get info from mongoDB
app.get("/info", (request, response, next) => {

  Person.find({}).then((persons) => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
    );
  })
  .catch(error => next(error));
})

//Create new person in phoneBook mongoDB

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (body.name === undefined) {
    return response.status(400).json({ error: "name missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  })
    .catch(error => next(error));
});

//Delete person in phoneBook mongoDB

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
   .then((result) => {
    response.status(204).end();
    })
  .catch(error => next(error));
});

// Update person in phoneBook mongoDB by ID Part 3.17

app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body;

    const person = {
      name: body.name,
      number: body.number,
    };

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators:true, context: 'query' })
      .then(updatedPerson => {
        response.json(updatedPerson);
      })
      .catch(error => next(error));
});


app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
