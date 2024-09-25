const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

//const url = `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`;
//luego del mongodb.net/agregamos nombre del schema para la db
const url = `mongodb+srv://mauroezequielflores48:${password}@cluster48.xanob.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=Cluster48`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  //Definicion de schema, le dice a mongoose como se almacenaran
  //los objetos de clase note en la bd
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema); //Se crea modelo Note, por convencion se crea luego como notes en plural y minuscula
//Los modelos son funciones constructoras, crean objetos JS. Tienen todas las propiedades de model

if (process.argv.length > 3) {
  const nameParameter = process.argv[3];
  const numberParameter = process.argv[4];

  const person = new Person({
    //Objeto de person para phoneBook
    name: nameParameter,
    number: numberParameter,
  });
  console.log(person);

  person.save().then((result) => {
    //Cuando se guarda el objeto en la bd, se invoca el then.
    //El resultado de la operacion se guarda en result
    console.log(
      `added ${nameParameter} number ${numberParameter} to phonebook`
    );
    mongoose.connection.close(); //se cierra conexion a bd, sino no termina nunca la ejecucion de la app
  });
}

if (process.argv.length < 4) {
  //dado que parameto find es {} (obj vacio), trae todas las notas de la coleccion notes
  //{ important: true } es posible traer todas las notas con variable important true
  Person.find({}).then((result) => {
    console.log("phonebook: ");
    result.forEach((person) => {
      console.log(person.name + " " + person.number);
    });
    mongoose.connection.close();
  });
}
