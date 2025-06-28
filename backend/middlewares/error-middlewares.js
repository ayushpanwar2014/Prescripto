export const errorMiddlewares = (err, req, res, next) => {
    console.error(err);
    return res.status(err.status || 500).json({ success: false, msg: err.message || "Internal Server Error" });
}