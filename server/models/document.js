const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
   // _id: { type: mongoose.Schema.Types.ObjectId},
   id: { type: String, required: true },
   name: { type: String, required: true },
   url: { type: String, required: true },
   children: { type: [], ref: 'Document' }
});

module.exports = mongoose.model('Document', documentSchema);