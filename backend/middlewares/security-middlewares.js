import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import ratelimit from 'express-rate-limit';

export const securityMiddleware = (app) => {

    // 1. Helmet for HTTP headers security
    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    connectSrc: ["'self'", "http://localhost:5173"], // React dev server
                    imgSrc: ["'self'", "data:"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                },
            },
            crossOriginResourcePolicy: { policy: "same-origin" },
        })
    )

    //frontend and admin
    const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL];

    // 2. CORS configuration for React app on 5173
    app.use(
        cors({
            origin: function (origin, callback) {
                if(!origin || allowedOrigins.includes(origin)){
                    callback(null, true);
                }
                else{
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
        message:  "Too many requests from this IP, please try again later.",
    });

    app.use(limiter);

};