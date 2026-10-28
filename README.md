# Digital Permission Management System

A comprehensive full-stack web application for managing college/university permission requests between students and faculty.

## 🌐 Live Demo

**[https://digital-permission-system.vercel.app](https://digital-permission-system.vercel.app)**

Deployed on Vercel with a Supabase (PostgreSQL) database. Sign in with the [demo credentials](#demo-credentials) below.

## Features

### 🎓 Student Features
- **Secure Login**: Role-based authentication with email/password
- **Request Submission**: Submit permission requests with reason, date/time, and file attachments
- **Real-time Updates**: See status changes instantly via Socket.IO
- **Request History**: View all submitted requests with status tracking
- **File Upload**: Support for medical certificates, invitations, and other documents

### 👨‍🏫 Faculty Features
- **Request Management**: View all student permission requests
- **Status Updates**: Approve, reject, or request more information
- **Real-time Notifications**: Get notified of new requests instantly
- **Filtering**: Filter requests by status (Pending, Approved, Rejected, Need More Info)
- **Comments**: Add comments when updating request status

### 🔧 Technical Features
- **Real-time Communication**: Socket.IO for instant updates
- **File Upload**: Multer for handling document uploads
- **Secure Authentication**: JWT-based authentication
- **Responsive Design**: Bootstrap 5 with custom styling
- **Database Integration**: Supabase (PostgreSQL) for persistent data storage

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL), accessed with the `pg` driver
- **Real-time**: Socket.IO
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Styling**: Custom CSS with Bootstrap components

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- A free Supabase project (https://supabase.com)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd digital-permission-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configuration
Secrets are read from a `.env` file (never commit it). Copy the example and fill in your values:
```bash
cp .env.example .env
```
```ini
DATABASE_URL=postgresql://postgres.your-project-ref:your-db-password@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
JWT_SECRET=a_long_random_string
PORT=3000
```
Get `DATABASE_URL` from the Supabase dashboard: **Project Settings > Database > Connection string > URI**, and put your database password in it. The server refuses to start without `DATABASE_URL` or `JWT_SECRET`.

### 4. Database Setup
Create the tables (safe to run more than once):
```bash
npm run db:setup
```
This applies `supabase/schema.sql`: the `users`, `request_categories`, `requests` and `request_files` tables, the default categories, and Row Level Security so the tables are not readable through Supabase's public REST API.

### 5. Start the Application
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### 6. Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

## Deploying to Vercel

The project is ready for Vercel: static pages are served from `public/`, and `/api/*` and `/uploads/*` are handled by the Express app through [api/index.js](api/index.js) (see [vercel.json](vercel.json)).

```bash
npm run db:setup                               # create the tables in Supabase
npx vercel login
npx vercel link
npx vercel env add DATABASE_URL production     # Supabase pooler string, port 6543
npx vercel env add JWT_SECRET production
npx vercel --prod
```

For `DATABASE_URL` on Vercel, use Supabase's **transaction pooler** (port `6543`), which suits serverless functions.

Differences from running with `npm start`:
- Vercel has no Socket.IO server, so the dashboards refresh requests every 15 seconds instead of instantly.
- Uploaded files are stored in the database (`request_files` table), since serverless functions have no persistent disk. Vercel limits request bodies to about 4.5MB.

## Demo Credentials

### Faculty Members (Password: 12345)
- Dr. Meena Reddy (meena.reddy@mallareddyuniversity.ac.in)
- Dr. Arjun Rao (arjun.rao@mallareddyuniversity.ac.in)

### Students (Password: 12345)
- Santhosh Chary (2311cs010647@mallareddyuniversity.ac.in)
- Tula Kethana Patel (2311cs010640@mallareddyuniversity.ac.in)
- Takkala Vineesh Reddy (2311cs010640b@mallareddyuniversity.ac.in)

## Database Schema

The full schema is in [supabase/schema.sql](supabase/schema.sql). It has four tables:

- **users**: id, name, email (unique), password (bcrypt hash), role (`student` or `faculty`), created_at
- **request_categories**: id, name, description, created_at
- **requests**: id, student_id, faculty_id, category_id, reason, date_time, expected_duration_days, file_path, status (`Pending`, `Approved`, `Rejected` or `Need More Info`), faculty_comment, created_at, updated_at (kept current by a trigger)
- **request_files**: name, data (file contents), created_at — attachments served at `/uploads/<name>`

## API Endpoints

### Authentication
- `POST /api/login` - User login

### Student Routes
- `GET /api/student/requests` - Get student's requests
- `POST /api/requests` - Submit new request

### Faculty Routes
- `GET /api/faculty/requests` - Get all requests
- `PUT /api/requests/:id/status` - Update request status

### General
- `GET /api/profile` - Get user profile

## File Structure
```
digital-permission-system/
├── public/
│   ├── index.html          # Login page
│   ├── student.html        # Student dashboard
│   └── faculty.html        # Faculty dashboard
├── api/index.js           # Vercel serverless entry point
├── uploads/                # Older disk-stored uploads (local only)
├── server.js              # Main server file
├── vercel.json            # Vercel routing
├── config.js              # Configuration
├── db.js                  # Postgres (Supabase) connection pool
├── supabase/schema.sql    # Database schema
├── scripts/db-setup.js    # Creates the tables (npm run db:setup)
├── package.json           # Dependencies
└── README.md             # This file
```

## Features in Detail

### Real-time Updates
When run with `npm start`, the application uses Socket.IO to provide real-time communication (on Vercel the dashboards poll every 15 seconds instead):
- Students see status updates immediately
- Faculty get notified of new requests instantly
- No page refresh required for updates

### File Upload
- Supports multiple file formats (PDF, DOC, DOCX, JPG, PNG, GIF)
- 5MB file size limit
- Files stored in the database and served at `/uploads/<name>`
- Secure file handling with validation

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- File upload security

### Responsive Design
- Mobile-friendly interface
- Bootstrap 5 components
- Custom CSS animations
- Smooth transitions and hover effects

## Development and modifications

### Adding New Features
1. Update the database schema if needed
2. Add new API routes in `server.js`
3. Update frontend JavaScript for new functionality
4. Test with different user roles

### Customization
- Modify `config.js` for different database settings
- Update CSS in HTML files for styling changes
- Add new user roles by updating the database schema


## Troubleshooting

### Common Issues
1. **Database Connection Error**: Check `DATABASE_URL` and the database password in Supabase; if your network blocks IPv6, use the Session pooler connection string
2. **File Upload Issues**: Run `npm run db:setup` so the `request_files` table exists
3. **Socket.IO Connection**: Check if port 3000 is available
4. **Authentication Issues**: Verify JWT secret in config

### Logs
Check the console output for detailed error messages and debugging information.

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support and questions, please create an issue in the repository or send a message.
