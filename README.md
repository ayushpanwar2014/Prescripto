

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=50&pause=1000&color=0E43F7&background=3159FF00&width=435&lines=🧑🏼‍⚕️+Prescripto+%E2%80%93+Healthcare+Appointment+Platform)](https://git.io/typing-svg)



<img width="1360" height="909" alt="Prescripto" src="https://github.com/user-attachments/assets/52ef534f-3a52-4ece-8180-1d904093fa07" />

Full-Stack Developer | Mar – Jun 2025
GitHub Repository: [https://github.com/ayushpanwar2014/Prescripto](https://github.com/ayushpanwar2014/Prescripto) | Remote  

---

<article>
  <h2>Tech Skills 🛠️</h2>

  <!-- Skillicons for supported skills -->
  <img src="https://skillicons.dev/icons?i=html,css,js,react,nodejs,expressjs,mongodb,redis,git,github&perline=5" alt="Tech Stack" />
  
![Zod](https://img.shields.io/badge/Zod-7A5AF8?style=for-the-badge&logo=zod)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-DB0D8B?style=for-the-badge&logo=cloudinary&logoColor=white)
![REST APIs](https://img.shields.io/badge/REST%20APIs-6C63FF?style=for-the-badge)
![CI/CD](https://img.shields.io/badge/CI%2FCD-E53E3E?style=for-the-badge)
![Agile](https://img.shields.io/badge/Agile-F6AD55?style=for-the-badge)
![Microservices](https://img.shields.io/badge/Microservices-805AD5?style=for-the-badge)
![DBMS](https://img.shields.io/badge/DBMS-D69E2E?style=for-the-badge)
![DSA](https://img.shields.io/badge/DataStructures--Algorithms-3182CE?style=for-the-badge)
</article>

<article>


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

## Environment Variables
The backend requires the following environment variables in a `.env` file:


```bash
PORT =
MONGODB_URL =
CLOUDINARY_NAME =
CLOUDINARY_API_KEY =
CLOUDINARY_API_SECRET =
ADMIN_EMAIL =
ADMIN_PASSSWORD =
JWT_SECRET =
RAZORPAY_KEYID =
RAZORPAY_KEY_SECRET = 
CURRENCY =
FRONTEND_URL = 
ADMIN_URL = 
REDIS_PASSWORD = 
REDIS_HOST = 
REDIS_PORT = 

````
The Frontend requires the following environment variables in a `.env` file:

```bash

VITE_BACKEND_URL = 
VITE_RAZORPAY_KEYID = 
````

---
The Admin requires the following environment variables in a `.env` file:

```bash

VITE_BACKEND_URL = 
````

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ayushpanwar2014/Prescripto.git
````

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

## License

MIT License


