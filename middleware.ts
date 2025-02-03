import { NextRequest, NextResponse } from "next/server";
import * as jwwt from "jose";

export default async function middleware(req:NextRequest,res:NextResponse){
    const tokenbearer = req.headers.get("authorization");
        if(!tokenbearer){
            return new NextResponse(
                JSON.stringify({
                    error:"Unauthorized Request: No Token Provided"
                }),{status:401}
            );
        }
    
        const token = tokenbearer.split(" ")[1];
        if(!token){
            return new NextResponse(
                JSON.stringify({
                    error:"Unauthorized Request: No Token Provided"
                }),{status:401}
            );
        }
    
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        // const verified = await jwwt.jwtVerify(token,secret);
        // if(!verified){
        //     return new NextResponse(
        //         JSON.stringify({
        //             error:"Unauthorized Request: Not Verified"
        //         }),{status:401}
        //     );
        // }
        try {
            await jwwt.jwtVerify(token,secret);
        } catch (error) {
            return new NextResponse(
                JSON.stringify({
                    error:"Unauthorized Request: Not Verified"
                }),{status:401}
            );
        }
}

export const config={
    matcher:["/api/auth/tokenuse",]
}