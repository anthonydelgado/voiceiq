/**
 * Created by user on 10/22/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var transcriptionSchema = new Schema({

    TranscriptionSid: String,
    TranscriptionText:   String,
    TranscriptionStatus:   String,
    TranscriptionUrl:   String,
    RecordingSid:   String,
    RecordingUrl:   String,
    CallSid:   String,
    AccountSid:   String,
    From:   String,
    To:   String,
    CallStatus:   String,
    ApiVersion:   String,
    Direction:   String

});

module.exports = mongoose.model('Transcription', transcriptionSchema);