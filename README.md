# Naikoria Tech Academy

**AI-Powered Online Tutoring Platform** by Naik Amal Shah

A comprehensive educational platform featuring AI-powered learning, live interactive sessions, and personalized education experiences optimized for Pakistan.

## Features

### AI-Powered Learning
- **AI Personal Tutor**: 24/7 support with intelligent responses (FREE template-based system)
- **Smart Quiz Generation**: Create personalized quizzes on any topic
- **Adaptive Learning Paths**: Customized content based on student progress

### Course Management
- **Complete Course System**: Course creation, enrollment, and progress tracking
- **Live Interactive Sessions**: Real-time video calls with tutors using WebRTC
- **Rich Content**: Video lessons, assignments, quizzes, and certificates

### Pakistan-Optimized Payments
- **Local Payment Methods**: EasyPaisa, JazzCash, Bank Transfers
- **PKR Currency**: Native Pakistani Rupee pricing
- **International Cards**: Stripe integration for global accessibility

### Premium UI/UX
- **Modern Design**: Professional educational interface with premium aesthetics
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Accessibility**: WCAG compliant with focus on usability

## Architecture

### Backend (Django REST Framework)
- **Python 3.11** with Django 4.2
- **PostgreSQL** database with Docker containerization
- **JWT Authentication** for secure user management
- **Celery** for background tasks and notifications
- **Redis** for caching and real-time features

### Frontend (Next.js 14)
- **React 18** with TypeScript
- **Tailwind CSS** for premium styling
- **Responsive Design** with mobile-first approach
- **State Management** with React hooks

### Infrastructure
- **Docker Compose** for development environment
- **Production Ready** with security best practices
- **CI/CD Ready** for automated deployments

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for frontend development)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/naikoria-tech-academy.git
cd naikoria-tech-academy
```

### 2. Backend Setup
```bash
# Start the backend services
docker-compose -f docker-compose.minimal.yml up -d

# Create database tables
docker-compose -f docker-compose.minimal.yml exec web python manage.py migrate

# Create test users
docker-compose -f docker-compose.minimal.yml exec web python create_test_users.py

# Access admin panel: http://localhost:8080/admin/
# Username: admin@naikoria.com | Password: admin123
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Access frontend: http://localhost:3000
```

## Demo Accounts

### Student Account
- **Email**: student1@test.com
- **Password**: test123

### Tutor Account
- **Email**: tutor1@test.com
- **Password**: test123

### Admin Account
- **Email**: admin@naikoria.com
- **Password**: admin123

## Key Pages

- **Homepage** (`/`) - Landing page with platform overview
- **Courses** (`/courses`) - Browse and search courses
- **Dashboard** (`/dashboard`) - Personalized student/tutor dashboard
- **AI Quiz** (`/ai/quiz`) - Generate and take AI-powered quizzes
- **Live Sessions** (`/sessions`) - Join live tutoring sessions
- **Authentication** (`/login`, `/register`) - User authentication

## Development

### Backend Development
```bash
# Run migrations
docker-compose -f docker-compose.minimal.yml exec web python manage.py makemigrations
docker-compose -f docker-compose.minimal.yml exec web python manage.py migrate

# Create superuser
docker-compose -f docker-compose.minimal.yml exec web python manage.py createsuperuser

# Access Django shell
docker-compose -f docker-compose.minimal.yml exec web python manage.py shell
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

### Database Management
```bash
# Backup database
docker-compose -f docker-compose.minimal.yml exec db pg_dump -U tutoring_user tutoring_platform > backup.sql

# Restore database
docker-compose -f docker-compose.minimal.yml exec db psql -U tutoring_user tutoring_platform < backup.sql
```

## API Endpoints

### Authentication
- `POST /api/v1/users/auth/register/` - User registration
- `POST /api/v1/users/auth/login/` - User login
- `POST /api/v1/users/auth/refresh/` - Token refresh

### Courses
- `GET /api/v1/courses/` - List courses
- `GET /api/v1/courses/{id}/` - Course details
- `POST /api/v1/courses/{id}/enroll/` - Enroll in course

### AI Features
- `POST /api/v1/ai/generate-quiz/` - Generate quiz
- `POST /api/v1/ai/chat/` - AI tutor chat

### Live Sessions
- `GET /api/v1/classroom/sessions/` - List sessions
- `POST /api/v1/classroom/sessions/{id}/join/` - Join session

## Payment Integration

### Supported Methods
1. **EasyPaisa** - Mobile wallet payments
2. **JazzCash** - Mobile wallet payments  
3. **Bank Transfer** - Direct bank transfers
4. **Credit/Debit Cards** - International cards via Stripe

### Configuration
Update payment settings in `.env.docker`:
```env
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
EASYPAISA_MERCHANT_ID=your_merchant_id
JAZZCASH_MERCHANT_ID=your_merchant_id
```

## Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using Django's built-in system
- **CORS Configuration** for secure API access
- **Environment Variables** for sensitive data
- **Input Validation** and sanitization
- **Rate Limiting** on API endpoints

## Analytics & Monitoring

- **User Engagement** tracking
- **Course Progress** analytics
- **Payment Transactions** monitoring
- **System Performance** metrics
- **Error Logging** and reporting

## Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Database backups automated
- [ ] SSL certificates installed
- [ ] Domain DNS configured
- [ ] CDN setup for static files
- [ ] Monitoring and logging enabled

### Environment Variables
```env
DEBUG=False
DATABASE_URL=postgresql://user:pass@host:port/db
SECRET_KEY=your_secret_key
ALLOWED_HOSTS=yourdomain.com
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Naik Amal Shah**
- GitHub: [@naikamalshah](https://github.com/naikamalshah)
- LinkedIn: [Naik Amal Shah](https://linkedin.com/in/naikamalshah)
- Email: admin@naikoria.com

## Acknowledgments

- **Django Community** for the robust framework
- **Next.js Team** for the excellent React framework
- **Tailwind CSS** for beautiful styling utilities
- **Heroicons** for the comprehensive icon library

## Support

For support and questions:
- Email: support@naikoria.com
- Documentation: [docs.naikoria.com](https://docs.naikoria.com)
- Issues: [GitHub Issues](https://github.com/yourusername/naikoria-tech-academy/issues)

---

**Made with love in Pakistan for global education accessibility**