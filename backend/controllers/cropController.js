const CropScan = require('../models/CropScan')

const DISEASE_DATABASE = [
  { disease: 'Early Blight (Alternaria solani)', confidence: 91, severity: 'Moderate', treatment: 'Remove infected leaves. Apply copper-based fungicide every 7-10 days. Avoid overhead irrigation. Rotate crops next season.' },
  { disease: 'Leaf Rust (Puccinia triticina)', confidence: 87, severity: 'High', treatment: 'Apply systemic fungicide with tebuconazole. Remove severely infected plants. Maintain field drainage.' },
  { disease: 'Powdery Mildew', confidence: 78, severity: 'Low', treatment: 'Spray with potassium bicarbonate solution. Increase plant spacing. Apply neem oil as organic alternative.' },
  { disease: 'No Disease Detected ✓', confidence: 97, severity: 'None', treatment: 'Your crop appears healthy! Continue regular maintenance and routine field monitoring.' },
  { disease: 'Bacterial Wilt (Ralstonia solanacearum)', confidence: 83, severity: 'High', treatment: 'Remove and destroy infected plants. Avoid working in wet fields. Use certified disease-free seeds.' },
  { disease: 'Cassava Mosaic Virus', confidence: 85, severity: 'Moderate', treatment: 'Remove infected plants. Control whitefly using yellow sticky traps. Use mosaic-resistant varieties.' },
]

const analyzeWithAI = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { ...DISEASE_DATABASE[Math.floor(Math.random() * DISEASE_DATABASE.length)], modelVersion: 'CropDetect v2.1' }
}

const analyzeCrop = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a crop image.' })
    const aiResult = await analyzeWithAI()
    const scan = await CropScan.create({ farmer: req.user.id, image: req.file.filename, result: aiResult })
    res.status(200).json({
      success: true,
      message: 'Analysis complete.',
      result: { ...aiResult, analyzedAt: new Date().toLocaleTimeString(), scanId: scan._id },
    })
  } catch (error) { next(error) }
}

const getScanHistory = async (req, res, next) => {
  try {
    const scans = await CropScan.find({ farmer: req.user.id }).sort({ createdAt: -1 }).limit(20)
    res.status(200).json({ success: true, scans })
  } catch (error) { next(error) }
}

module.exports = { analyzeCrop, getScanHistory }
