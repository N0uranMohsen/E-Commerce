import jwt from "jsonwebtoken";
export const generateToken = ({ payload, secretKey = "SecretKey" }) => {
  return jwt.sign(payload, secretKey);
};

export const verifyToken = ({ token, secretKey="SecretKey" }) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return { message: error.message };
  }
};
// export const verifyToken = async(req,res,next)=>{
//   const {token} =req.headers
//   jwt.verify(token,'SecretKey',async(err,decoded)=>{
//       if(err) return res.status(401).json({message:'invalid Token'})
//       req.user = decoded
//       next()
// })
// }