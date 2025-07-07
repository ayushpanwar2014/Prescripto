import jwt from 'jsonwebtoken'

export const authDoctor_VerifyToken = async (req,res, next) => {

    const docToken = req.cookies.docToken;
    
    try {
        if(!docToken){
            return  res.status(400).json({ success: false, msg: "UnAuthorized Accessss!" });
        }
        const decodeToken = jwt.verify(docToken,process.env.JWT_SECRET);

        if(!decodeToken){
            
            return  res.clearCookie('docToken').status(400).json({ success: false, msg: "UnAuthorized Access!" });
        }
        
        req.user = decodeToken;
        next();

    } catch (err) {
         const error = {
            status: 401,
            message: 'Something is Wrong!'
        };
        next(error);
    }
}