const mongoose = require('mongoose')

const gpsSchema = new mongoose.Schema({
    DeviceId: {
        type: String,
        required: true,
        trim: true,
    },
    'Device Type': {
        type: String,
        required: true,
        trim: true,
    },
    Timestamp: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
})


const gps = mongoose.model('gps_summary', gpsSchema, 'gps_summary')

module.exports = gps