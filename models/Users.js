const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    email: String,
    password: String,
  });
  //isme above se connect hua and then ye nihce schema define kiya and collection ka name User rakha 
module.exports =  mongoose.model('Users', userSchema,'Users') //ab model bana ke User collection ko export kar de 