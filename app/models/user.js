var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  ;

var UserSchema = new Schema({
  name: String,
  email: String,
  avatar: Buffer,
  googleId: String
});

mongoose.model('User', UserSchema);
