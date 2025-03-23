"use client"
import React, { useState } from 'react'
import {BookingSize, times} from '../../../../../BookingSize';
import availability from '../../../../../pages/api/restaurant/[slug]/availability';

export default function ReservationCard({
  openingHours,closingHours,slug
}:{openingHours:string,closingHours:string, slug:string}) {

  const [date,setDate] = useState<Date | null>(new Date());
  const [size,setSize] = useState<number>(BookingSize[0]?.value||1);
  const [selectedTime,setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  // const [result, setResult] = useState<any>(null);

  const handleDateChange = (date: Date | null)=>{
    if(date){
      return setDate(date)
    }
    return setDate(null)
  }

  const handleFindTime = async ()=>{
    setLoading(true);
    setError("");
    try {
      if(!date || !selectedTime){
        setError("Please enter correct details");
        console.log("enter correct detail");
        return;
      }
      const day = date.toISOString().split("T")[0];
      const {data,error} = await availability({slug,day,time:selectedTime,size:size.toString()});
      console.log(data,error);
      if(error){
        setError(error?.message??error?.error??error);
        return;
      }
    } catch (error:any) {
      setError(error?.message??error?.error??error);
    }finally{
      setLoading(false);
    }
    // if(!date || !selectedTime){
    //   console.log("enter correct detail")
    //   return;
    // }
    // const day = date.toISOString().split("T")[0];
    // const queryParams = new URLSearchParams({
    //   day,
    //   time: selectedTime,
    //   size: size.toString()
    // });
    // // http://localhost:3000/restaurant/vivaan-fine-indian-cuisine-ottawa/availability?day=2024-03-03&time=02:00:00.000Z&
    // const url = `http://localhost:3000/api/restaurant${slug}/availability?${queryParams.toString()}`
    // try{
    //   const res = await fetch(url);
    //   const data = await res.json();
    //   console.log(data);
    // }catch(e){
    //   console.log(e);
    // }
    // const data = await availability({slug,day:date.toISOString().split("T")[0],time:selectedTime,size:size.toString()});
    // console.log("data are", data);
  }

  const filterTime = ()=>{
    const window: typeof times = [];
    let flag = false;
    times.forEach(i=>{
      if(i.time === openingHours){
        flag = true
      }
      if(flag){
        window.push(i)
      }
      if(i.time === closingHours){
        flag = false
      }
    })
    return window;
    
  }
  return (
    <div className="fixed w-[19%] bg-white rounded p-3 shadow">
          <div className="text-center border-b pb-2 font-bold">
            <h4 className="mr-7 text-lg">Make a Reservation</h4>
          </div>

          <div className="my-3 flex flex-col">
            <label htmlFor="">Party size</label>
            <select name="" className="py-3 border-b font-light cursor-pointer" id="" onChange={(e)=>setSize(parseInt(e.target.value))}>
              {BookingSize.map((i)=>{
                return <option key={i.value} value={i.value}>{i.label}</option>
              })}
            </select>
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col w-[48%]">
              <label htmlFor="">Date</label>
              <input type="date" onChange={(e) => handleDateChange(e.target.value ? new Date(e.target.value) : null)} className="py-3 border-b font-light w-30 cursor-pointer" />
            </div>

            <div className="flex flex-col w-[48%]">
              <label htmlFor="">Time</label>
              <select name="" id="" className="py-3 border-b font-light cursor-pointer" onChange={(e)=>setSelectedTime(e.target.value)}>
                {/* todo */}
                {/* <option value="">7:30 AM</option>
                <option value="">9:30 AM</option> */}
                {filterTime().map(i=>(
                  <option key={i.time} value={i.time}>{i.displayTime}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5">
            <button onClick={handleFindTime}
              className="bg-red-600 rounded w-full px-4 text-white font-bold h-16 cursor-pointer"
            >
              {loading? "Loading...":"Find a Time"}
            </button>
          </div>
          
        </div>
  )
}
