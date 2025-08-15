Got it! Here's a **professional, polished GitHub README** for Prescripto with badges, tech icons, and a clean structure:

````markdown
# Prescripto 🏥

[![GitHub Repo](https://img.shields.io/badge/GitHub-Prescripto-blue?logo=github)](https://github.com/ayushpanwar2014/Prescripto)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)]()
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)]()
[![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)]()
[![Cloudinary](https://img.shields.io/badge/Cloudinary-DB0D8B?logo=cloudinary&logoColor=white)]()
[![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)]()

---

## Overview
**Prescripto** is a full-stack **MERN healthcare platform** enabling **100+ real-time bookings per day**. The system improves appointment workflow by **50%** through **role-based access** (Admin, Doctor, Patient). Integrated **Razorpay** and **COD** support provide flexible payments, while **secure authentication with JWT, rotating refresh tokens, and HTTP-only cookies** reduces unauthorized access by **80%**. **Redis caching** ensures optimized performance, and **Cloudinary** handles media management.

---

## Key Features
- **Role-Based Access:** Admin, Doctor, Patient dashboards  
- **Real-Time Bookings:** Efficient appointment management  
- **Payment Integration:** Razorpay + COD support  
- **Secure Authentication:** JWT, rotating refresh tokens, HTTP-only cookies  
- **Caching:** Redis for optimized performance  
- **Media Management:** Cloudinary for images and files  
- **API Validation:** Zod for request validation  
- **Security:** Helmet, HPP, rate limiting  

---

## Tech Stack
**Frontend:** React.js, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Cache:** Redis  
**Authentication:** JWT  
**Payments:** Razorpay  
**Media:** Cloudinary  
**Validation:** Zod  
**Security:** Helmet, HPP, Rate Limiting  

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

## Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/ayushpanwar2014/Prescripto.git
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Start the backend server:

```bash
npm start
```

4. Install and start frontend apps in `/frontend` and `/admin`:

```bash
cd frontend
npm install
npm start
```

```bash
cd admin
npm install
npm start
```

---

## Backend Dependencies

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

<img width="1360" height="909" alt="Prescripto" src="https://github.com/user-attachments/assets/4d383a52-7f4c-4c86-b64a-9ed7a10ffbab" />

---

## License

MIT License

---

## Contact

Ayush Singh Panwar
[GitHub](https://github.com/ayushpanwar2014) | [Portfolio](https://ayushpanwar2014.github.io/Portfolio/) | [ayush.panwar2014@gmail.com](mailto:ayush.panwar2014@gmail.com)

```

