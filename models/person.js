const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("Connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("Connected to MongoDB phonebook DB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB; ", error.message);
  });

const personSchema = new mongoose.Schema({
  name: { //mongoose middleware validation
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d{8,}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number`
    },
    required: [true, 'User phone number required'],
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v; //field _v MongoDB
  },
});

module.exports = mongoose.model("Person", personSchema);
