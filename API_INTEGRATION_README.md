# API Integration - Quick Start Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd a:\FIGMA\rwooga-backend\rwooga-project
npm install
```

### 2. Start Backend (Django)

```bash
cd a:\FIGMA\rwooga-backend
python manage.py runserver
```

### 3. Start Frontend (React)

```bash
cd a:\FIGMA\rwooga-backend\rwooga-project
npm run dev
```

## ✅ What's Been Connected

### Authentication APIs
- ✅ User Signup (`/auth/register/`)
- ✅ Email Verification (`/auth/verify_email/`) 
- ✅ Resend Verification (`/auth/resend_verification/`)
- ✅ Login (`/auth/login/`)

### Products APIs
- ✅ Service created in `services/productsService.ts`
- ⏳ Shop page ready to integrate (currently uses static data)

## 📝 Test the Signup Flow

1. **Go to Signup**: `http://localhost:5173/signup`

2. **Register a new user**:
   - Name: John Doe
   - Phone: 0712345678
   - Email: john@test.com
   - Password: Test@123456

3. **Check Django console** for the verification link

4. **Copy and paste the link** in your browser

5. **Login** with the verified email

## 🔑 Environment Variables

The frontend now uses `.env.local`:
```env
VITE_API_URL=http://localhost:8000
```

For production, update to your deployed backend URL.

## 📚 Documentation

See [walkthrough.md](file:///C:/Users/USER/.gemini/antigravity/brain/dca4139e-1443-4e64-8f64-98c5bfdc0784/walkthrough.md) for detailed documentation of all changes.

---

**Note**: TypeScript errors about missing modules will resolve once you run `npm install`.
