import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import bcrypt from "bcrypt";
import * as jwt from "jose";
import {setCookie} from "cookies-next"


const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    if(req.method === "POST"){
        const {email,password} = req.body;

        const validationSchema = z.object({
                email: z.string().email().nonempty("Email is required"),
                password: z.string().min(1, "Password is required"),
            })
        const validated = validationSchema.safeParse({email,password});
        if(!validated.success){
            return res.status(400).json({errors:validated.error})
        }

        const userEmail = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!userEmail){
            return res.status(401).json({error:"Invalid Credentials"})
        }

        const passwordMatch = await bcrypt.compare(password, userEmail.password);
        if(!passwordMatch){
            return res.status(401).json({error:"Invalid Credentials"})
        }
        const algo = "HS256";
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new jwt.SignJWT({email:userEmail.email})
        .setProtectedHeader({alg:algo})
        .setExpirationTime("24h")
        .sign(secret);

        setCookie("jwt",token,{req,res,maxAge:60*60*24})

        return res.status(200).json({
            firstName:userEmail.first_name,
            lastName:userEmail.last_name,
            city:userEmail.city,
            phone:userEmail.phone,
            email:userEmail.email,
            token:token
        })
         
    }else{
        res.status(405).json({error:"Method Not Allowed"});
    }
}