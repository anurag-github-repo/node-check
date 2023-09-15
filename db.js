const mongoose = require('mongoose')

const mongouri = ; //see here database name, enter link here
const mongoConnect = mongoose.connect(mongouri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Connected to the database'); 
})
.catch((error) => {
  console.log('Error connecting to the database:', error);
});

