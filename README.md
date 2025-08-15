![hero4 copy](https://github.com/user-attachments/assets/10172215-ee37-4869-8a10-32c663dc9819)Here’s a clean, professional README for your **Prescripto** project based on the info you provided:

````markdown
# Prescripto – Healthcare Appointment Platform

**Full-Stack Developer | Mar – Jun 2025**  
GitHub Repository: [https://github.com/ayushpanwar2014/Prescripto](https://github.com/ayushpanwar2014/Prescripto) | Remote  

---

## Overview
Prescripto is a MERN stack healthcare platform designed to handle over **100 real-time bookings per day**. It improves appointment workflow by **50%** through role-based access for **Admin, Doctor, and Patient**. The platform integrates **Razorpay** and **COD** support for flexible payments, and employs **JWT authentication with rotating refresh tokens and HTTP-only cookies**, reducing unauthorized access by **80%**. Additionally, **Redis** caching and **Cloudinary** integration enhance performance and media handling.

---

## Features
- Role-based access control (Admin / Doctor / Patient)  
- Real-time appointment bookings  
- Razorpay & COD payment integration  
- Secure authentication with JWT, rotating refresh tokens, HTTP-only cookies  
- Redis caching for optimized performance  
- Media management with Cloudinary  
- CRUD operations for users, appointments, and doctors  
- RESTful API endpoints for frontend consumption  

---

## Tech Stack
- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Caching:** Redis  
- **Payment:** Razorpay  
- **Media:** Cloudinary  
- **Authentication:** JWT, HTTP-only cookies  
- **Validation:** Zod  
- **Security:** Helmet, HPP, Rate Limiting  

---

## Environment Variables
Create a `.env` file in the backend root:

```env
PORT=7060
MONGODB_URL='your-mongodb-uri'
CLOUDINARY_NAME=dwv7jodex
CLOUDINARY_API_KEY=145279288223499
CLOUDINARY_API_SECRET=lDD4yai4mx-0OMFON45HXRIpvtQ
ADMIN_EMAIL=admin@prescripto.com
ADMIN_PASSSWORD=qwerty123
JWT_SECRET=secret123
RAZORPAY_KEYID=rzp_test_unOHZAGi8HMEX0
RAZORPAY_KEY_SECRET='ENXv9P3WURA1uh85XfHF14z5'
CURRENCY=INR
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
REDIS_PASSWORD=D8h6YvMatg1F2okGH8BTWMBFrYJ8GVAy
REDIS_HOST=redis-13046.crce199.us-west-2-2.ec2.redns.redis-cloud.com
REDIS_PORT=13046
````

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ayushpanwar2014/Prescripto.git
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Run the backend server:

```bash
npm start
```

4. Set up frontend in `/frontend` and `/admin` folders (React apps) and run with `npm start`.

---

## NPM Dependencies (Backend)

* argon2
* cloudinary
* cookie-parser
* cors
* dotenv
* express
* express-rate-limit
* helmet
* hpp
* jsonwebtoken
* mongoose
* morgan
* multer
* razorpay
* redis
* zod

---

## Screenshots


---

## License

MIT License

```

---

I can also **make a compact version suitable for GitHub README front page** with badges, tech icons, and a one-paragraph project description if you want it to look really professional.  

Do you want me to do that?
```
