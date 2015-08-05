var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  ;

var TodoSchema = new Schema({
  title: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  list: Schema.Types.ObjectId,
  owner: String,
  completed: Boolean
});

mongoose.model('Todo', TodoSchema);
