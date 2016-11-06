/**
 * Created by user on 10/22/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
    author: String,
    body:   String,
    comments: [{ author: String, body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
        votes: Number,
        favs:  Number
    }
});

module.exports = mongoose.model('Question', questionSchema);