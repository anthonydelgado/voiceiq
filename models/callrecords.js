/**
 * Created by user on 10/22/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CallRecord = new Schema({
    to: String,
    from: String,
    direction: String,
    date_created: String
});

module.exports = mongoose.model('CallRecord', CallRecord);