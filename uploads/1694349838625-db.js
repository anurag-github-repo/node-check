const mongoose = require('mongoose')

const mongouri = "mongodb+srv://ujjawal:ujjawal123@crud-app.bm61lxf.mongodb.net/?retryWrites=true&w=majority"
const mongoConnect = mongoose.connect(mongouri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Connected to the database'); 
})
.catch((error) => {
  console.log('Error connecting to the database:', error);
});

