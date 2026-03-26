const mongoose = require('mongoose')

const cropScanSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String, required: true },
    result: {
      disease: { type: String, default: '' },
      confidence: { type: Number, default: 0 },
      severity: { type: String, enum: ['None', 'Low', 'Moderate', 'High'], default: 'None' },
      treatment: { type: String, default: '' },
      modelVersion: { type: String, default: 'CropDetect v2.1' },
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('CropScan', cropScanSchema)
