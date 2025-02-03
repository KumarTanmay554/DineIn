import { NextApiRequest, NextApiResponse } from "next";
import {z} from 'zod'
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt";
import * as jwt from "jose";
import { setCookie } from "cookies-next";

const prisma = new PrismaClient();

const validationSchema = z.object({
    email: z.string().email().nonempty("Email is required"),
    password: z.string()
        .min(1, "Password must be at least 10 characters long"),
    firstName: z.string().min(2, "First name must be at least 2 characters long").max(20, "First name must be at most 20 characters long"),
    lastName: z.string().min(2, "Last name must be at least 2 characters long").max(20, "Last name must be at most 20 characters long"),
    city: z.string().min(2, "City must be at least 2 characters long"),
    phone: z.string().min(10, "Phone number must be at least 10 characters long").max(12, "Phone number must be at most 12 characters long"),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // res.status(200).json({hello:"there"})

    if(req.method === "POST"){
        const body = req.body;

        const validation = validationSchema.safeParse(body);
        if(!validation.success){
            return res.status(400).json({errors:validation.error})
        }

        const userEmail = await prisma.user.findUnique({
            where:{
                email:body.email
            }
        })

        if(userEmail){
            return res.status(400).json({errors:{email:"Email already exists"}})
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);
        const user = await prisma.user.create({
            data:{
                first_name:body.firstName,
                last_name:body.lastName,
                email:body.email,
                password:hashedPassword,
                city:body.city,
                phone:body.phone
            }
        });

        const algo = "HS256";
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new jwt.SignJWT({email:user.email})
        .setProtectedHeader({alg:algo})
        .setExpirationTime("24h")
        .sign(secret);
        setCookie("jwt",token,{req,res,maxAge:60*60*24})


        return res.status(200).json({
            firstName:user.first_name,
            lastName:user.last_name,
            city:user.city,
            phone:user.phone,
            email:user.email,
        })
    }else{
        res.status(405).json({message:"Method not allowed"})
    }
}