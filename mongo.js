const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://mauroezequielflores48:${password}@cluster48.xanob.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=Cluster48`;

mongoose.set("strictQuery", false);

mongoose.connect(url).then(() => {
  const personSchema = new mongoose.Schema({
    //Definicion de schema, le dice a mongoose como se almacenaran
    //los objetos de clase note en la bd
    name: String,
    number: String,
  });
});

const Person = mongoose.model("Person", personSchema); //Se crea modelo Note, por convencion se crea luego como notes en plural y minuscula
//Los modelos son funciones constructoras, crean objetos JS. Tienen todas las propiedades de model

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
