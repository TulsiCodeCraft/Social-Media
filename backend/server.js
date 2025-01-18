import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import multer from 'multer'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

app.get('/', (req, res) => {
  res.send('Server is running!');
});

const corsOptions = {
  origin: ['https://social-media-three-hazel.vercel.app'], // Add your frontend URL here
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow required headers
  credentials: true, // Allow cookies and credentials
};

app.use(cors(corsOptions))
app.use(express.json())
app.use('/uploads', express.static('uploads'))

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((error) => console.error('Error connecting to MongoDB:', error))

const userSubmissionSchema = new mongoose.Schema({
  name: String,
  socialHandle: {
    type: String,
    get: function(v) {
      if (v.startsWith('http://') || v.startsWith('https://')) {
        return v;
      }
      return `https://${v}`;
    }
  },
  images: [String],
  createdAt: { type: Date, default: Date.now }
})

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
})

const UserSubmission = mongoose.model('UserSubmission', userSubmissionSchema)
const Admin = mongoose.model('Admin', adminSchema)

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage })


const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token provided' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.adminId = decoded.adminId
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

app.post('/api/submissions', upload.array('images'), async (req, res) => {
  try {
    const { name, socialHandle } = req.body
    const images = req.files.map(file => file.path)

    const submission = new UserSubmission({
      name,
      socialHandle,
      images
    })

    await submission.save()
    res.status(201).json(submission)
  } catch (error) {
    res.status(500).json({ message: 'Error creating submission' })
  }
})

app.post('/api/admin/register', async (req, res) => {
  try {
    const { username, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    const admin = new Admin({
      username,
      password: hashedPassword
    })

    await admin.save()
    res.status(201).json({ message: 'Admin registered successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin' })
  }
})

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const admin = await Admin.findOne({ username })

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isValidPassword = await bcrypt.compare(password, admin.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    })

    res.json({ token })
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' })
  }
})

app.get('/api/submissions', verifyToken, async (req, res) => {
  try {
    const submissions = await UserSubmission.find().sort({ createdAt: -1 })
    res.json(submissions)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions' })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})