# Cultural Community Website - Setup Guide

## Project Overview
This is a complete cultural community website built with Node.js, Express, MongoDB, and vanilla JavaScript. The website allows community members to register, connect, share cultural content, and participate in events.

## Features Implemented
- ✅ User authentication (JWT-based)
- ✅ Member registration with admin approval
- ✅ Member directory with search and filters
- ✅ Events management system
- ✅ Cultural articles and blog posts
- ✅ Photo gallery
- ✅ Contact form and feedback system
- ✅ Admin dashboard
- ✅ Responsive design
- ✅ File upload for images
- ✅ Cultural-themed UI design

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git (optional)

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory (already created) and update the values:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cultural_community
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### 3. MongoDB Setup
- Install MongoDB locally or use MongoDB Atlas (cloud)
- Update the `MONGODB_URI` in `.env` file
- The application will automatically create the database and collections

### 4. Create Upload Directory
```bash
mkdir public/uploads
```

### 5. Add Sample Images (Optional)
Place sample images in `public/images/` directory:
- cultural-banner.jpg (hero section background)
- default-avatar.png (default profile picture)
- placeholder.jpg (gallery placeholder)
- festival1.jpg, dance.jpg, crafts.jpg, food.jpg, ceremony.jpg, music.jpg (gallery images)

### 6. Start the Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3000`

## Default Admin Account
To create an admin account, you'll need to manually update a user in the database:

1. Register a normal account through the website
2. Connect to your MongoDB database
3. Update the user document:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { 
    $set: { 
      role: "admin", 
      isApproved: true 
    } 
  }
)
```

## Project Structure
```
cultural-community-website/
├── controllers/           # Business logic
│   ├── authController.js
│   ├── memberController.js
│   ├── eventController.js
│   └── postController.js
├── middleware/           # Custom middleware
│   ├── auth.js
│   └── upload.js
├── models/              # MongoDB schemas
│   ├── User.js
│   ├── Event.js
│   ├── Post.js
│   └── Contact.js
├── routes/              # API routes
│   ├── auth.js
│   ├── members.js
│   ├── events.js
│   └── posts.js
├── public/              # Static files
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── images/
│   └── uploads/
├── views/               # HTML templates
│   ├── index.html
│   ├── about.html
│   ├── culture.html
│   ├── members.html
│   ├── events.html
│   ├── contact.html
│   ├── login.html
│   ├── register.html
│   └── admin.html
├── server.js            # Main server file
├── package.json
└── .env
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Members
- `GET /api/members` - Get approved members
- `GET /api/members/:id` - Get member by ID
- `GET /api/members/admin/pending` - Get pending members (admin)
- `PUT /api/members/admin/approve/:id` - Approve member (admin)
- `DELETE /api/members/admin/reject/:id` - Reject member (admin)

### Events
- `GET /api/events` - Get events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

### Posts & Contact
- `GET /api/posts` - Get published posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create post (admin)
- `PUT /api/posts/:id` - Update post (admin)
- `DELETE /api/posts/:id` - Delete post (admin)
- `POST /api/posts/contact` - Submit contact form
- `GET /api/posts/admin/contacts` - Get contact messages (admin)

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String (required),
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  profession: String (required),
  bio: String,
  profileImage: String,
  role: String (enum: ['member', 'admin']),
  isApproved: Boolean (default: false),
  dateJoined: Date (default: now)
}
```

### Event Model
```javascript
{
  title: String (required),
  description: String (required),
  date: Date (required),
  time: String (required),
  location: String (required),
  image: String,
  type: String (enum: ['event', 'announcement', 'festival']),
  createdBy: ObjectId (ref: User),
  createdAt: Date (default: now)
}
```

### Post Model
```javascript
{
  title: String (required),
  content: String (required),
  excerpt: String (required),
  image: String,
  category: String (enum: ['history', 'culture', 'tradition', 'festival', 'food', 'language']),
  author: ObjectId (ref: User),
  isPublished: Boolean (default: false),
  createdAt: Date (default: now)
}
```

### Contact Model
```javascript
{
  name: String (required),
  email: String (required),
  subject: String (required),
  message: String (required),
  type: String (enum: ['contact', 'feedback', 'suggestion']),
  isRead: Boolean (default: false),
  createdAt: Date (default: now)
}
```

## Security Features
- Password hashing with bcryptjs
- JWT token authentication
- Input validation with express-validator
- File upload restrictions (images only, 5MB limit)
- Admin-only routes protection
- CORS enabled
- Cookie-based token storage

## Customization Guide

### 1. Branding & Colors
Update CSS variables in `public/css/style.css`:
```css
:root {
  --primary-color: #8B4513;    /* Main brand color */
  --secondary-color: #D2691E;  /* Secondary color */
  --accent-color: #CD853F;     /* Accent color */
  /* ... other colors */
}
```

### 2. Community Information
Update content in HTML files:
- `views/index.html` - Homepage content
- `views/about.html` - Community history and information
- `views/culture.html` - Cultural details

### 3. Add Custom Features
- Extend models in `models/` directory
- Add new routes in `routes/` directory
- Create corresponding controllers in `controllers/`
- Update frontend JavaScript in `public/js/main.js`

## Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
1. Set `NODE_ENV=production` in `.env`
2. Use a production MongoDB instance
3. Set a strong JWT secret
4. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name "cultural-community"
```

### Cloud Deployment (Heroku Example)
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Connect to MongoDB Atlas
4. Deploy using Git:
```bash
git add .
git commit -m "Initial deployment"
git push heroku main
```

## Troubleshooting

### Common Issues
1. **MongoDB Connection Error**: Check if MongoDB is running and connection string is correct
2. **File Upload Issues**: Ensure `public/uploads/` directory exists and has write permissions
3. **JWT Errors**: Verify JWT_SECRET is set in environment variables
4. **Admin Access**: Manually set user role to 'admin' in database

### Logs
Check server logs for detailed error information:
```bash
npm run dev  # Development logs
pm2 logs cultural-community  # Production logs
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make changes and test thoroughly
4. Submit a pull request

## License
This project is open source and available under the MIT License.

## Support
For support and questions, please contact the development team or create an issue in the project repository.