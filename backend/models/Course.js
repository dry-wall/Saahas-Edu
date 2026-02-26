const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    instructor: { type: String, required: true },

    // Core content structured for your Universal Platform
    modules: [{
        title: { type: String, required: true },
        content: { type: String, required: true }, // Standard curriculum 
        simplifiedContent: { type: String },       // Neurodiversity & learning aids 
        videoUrl: { type: String },                // Media Storage 
        hasSignLanguageOverlay: { type: Boolean, default: false } // Sensory Support 
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', CourseSchema);