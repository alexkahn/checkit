var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  ;

var ListSchema = new Schema({
  name: String,
  owner: Schema.Types.ObjectId,
  users: [Schema.Types.ObjectId],
  todos: [Schema.Types.ObjectId]
});

mongoose.model('List', ListSchema);
