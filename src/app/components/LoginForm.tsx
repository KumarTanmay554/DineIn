"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { Authcontext } from "../context/AuthContext";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function LoginForm() {
    const [input, setInput] = useState({
          email : "",
          password : "",
        });
        const {error,loading,data,setAuthState} = useContext(Authcontext);
        const {signin} = useAuth();
        const [disabled,setDisable] = useState(true)
        useEffect(()=>{
          if(input.email.length>0 && input.password.length>0){
            setDisable(false)
          }else{
            setDisable(true)
          }
        },[input])
        const handleClick =()=>{
          signin({email:input.email,password:input.password})
        }
  return (
    <div className="grid gap-4 py-4">
          {loading ? (
            <div><Progress value={33}/></div>
          ) : (
            <>
              {error ? (
                <AlertDialog>
                {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
                <AlertDialogContent>
                  <AlertDialogHeader>
                    {/* <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle> */}
                    <AlertDialogDescription>
                      {error}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    {/* <AlertDialogAction>Continue</AlertDialogAction> */}
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              ) : (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      placeholder="xyz@gmail.com"
                      className="col-span-3"
                      onChange={(e) => {
                        setInput({ ...input, email: e.target.value });
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Password
                    </Label>
                    <Input
                      id="password"
                      placeholder="Password"
                      className="col-span-3"
                      onChange={(e) => {
                        setInput({ ...input, password: e.target.value });
                      }}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-red-600"
                    disabled={disabled}
                    onClick={handleClick}
                  >
                    Signin
                  </Button>
                </>
              )}
            </>
          )}
        </div>
  )
}
