import { NextApiRequest, NextApiResponse } from "next";
// import * as jwwt from "jose"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    const tokenbearer = req.headers.authorization as string;
    if(!tokenbearer){
        return res.status(401).json({error:"Unauthorized Request: No Token Provided"})
    }

    const token = tokenbearer.split(" ")[1];
    // if(!token){
    //     return res.status(401).json({error:"Unauthorized Request: No Token Provided"})
    // }

    // const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    // const verified = await jwwt.jwtVerify(token,secret);
    // if(!verified){
    //     return res.status(401).json({error:"Unauthorized Request: Invalid Token"})
    // }

    const decoded = jwt.decode(token) as {email:string};
    if(!decoded.email){
        return res.status(401).json({error:"Unauthorized Request"})
    }

    const userdecoed = await prisma.user.findUnique({
        where:{
            email:decoded.email
        },
        select:{
            email:true,
            first_name:true,
            last_name:true,
            city:true,
            phone:true,
            created_at:true,
            updated_at:true,
            id:true
        }
    })
    if(!userdecoed){
        return res.status(401).json({error:"User Not Found"})
    }
    return res.status(200).json({
        id:userdecoed?.id,
        email:userdecoed?.email,
        firstName:userdecoed?.first_name,
        lastName:userdecoed?.last_name,
        city:userdecoed?.city,
        phone:userdecoed?.phone,
        created_at:userdecoed?.created_at,
    })


}