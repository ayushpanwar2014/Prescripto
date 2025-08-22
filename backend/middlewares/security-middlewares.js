import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import ratelimit from 'express-rate-limit';

export const securityMiddleware = (app) => {


    // Frontend URLs
    const MAIN_FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const ADMIN_FRONTEND_URL = process.env.ADMIN_URL || "http://localhost:5174";
    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: [
                        "'self'",
                        "'unsafe-inline'",
                        ...([MAIN_FRONTEND_URL, ADMIN_FRONTEND_URL])
                    ],
                    connectSrc: [
                        "'self'",
                        ...([MAIN_FRONTEND_URL, ADMIN_FRONTEND_URL, BACKEND_URL]),
                    ],
                    imgSrc: ["'self'", "data:", MAIN_FRONTEND_URL, ADMIN_FRONTEND_URL],
                    styleSrc: ["'self'", "'unsafe-inline'", MAIN_FRONTEND_URL, ADMIN_FRONTEND_URL],
                    fontSrc: ["'self'", MAIN_FRONTEND_URL, ADMIN_FRONTEND_URL],
                    frameSrc: ["'self'", MAIN_FRONTEND_URL, ADMIN_FRONTEND_URL],
                },
            },
            crossOriginResourcePolicy: { policy: "same-origin" },
        })
    );


    //frontend and admin
    const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL];

    // 2. CORS configuration for React app on 5173
    app.use(
        cors({
            origin: function (origin, callback) {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            credentials: true
        })
    )

    // 3. Prevent HTTP Parameter Pollution attacks
    app.use(hpp());

    const limiter = ratelimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, //max 100 requests per IP per windowMs
        standardHeaders: true,
        legacyHeaders: false,
        message: "Too many requests from this IP, please try again later.",
    });

    app.use(limiter);

};