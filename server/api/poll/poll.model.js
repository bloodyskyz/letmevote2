'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PollSchema = new Schema({
  username: String,
  name: String,
  polls: Object
});

module.exports = mongoose.model('Poll', PollSchema);