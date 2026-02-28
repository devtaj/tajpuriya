const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://officialdev:devtajpuriya@cluster0.byner.mongodb.net/tajpuriya_samaj?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Connection string:', MONGODB_URI.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@'));
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/members', require('./routes/members'));
app.use('/api/events', require('./routes/events'));
app.use('/api/posts', require('./routes/posts'));

// Serve static pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/culture', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'culture.html'));
});

app.get('/members', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'members.html'));
});

app.get('/events', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'events.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

app.get('/articles', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'articles.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

app.get('/admin-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin-login.html'));
});

app.get('/admin-register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin-register.html'));
});

app.get('/submit-article', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'submit-article.html'));
});

app.get('/article/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'article-detail.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'profile.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});