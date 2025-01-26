"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import CopyRight from '@/components/copybar/page';
import DarkModeButton from '@/components/darkmode/page';
import { PhoneInput } from './phone-input';
import { FaRegEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const SignupU = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to track password visibility
  const [loading, setLoading] = useState(false); // State to track loading state

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      toast.info("Already Logged In.", {
        style: {
          background: 'red',
          color: 'white',
        },
      }),
      router.push('/'); // Redirect to home page if token exists
    }
  }, [router]); 

  const alertIncompleteFields = () => {
    toast.info("Please fill all fields.", {
      style: {
        background: 'red',
        color: 'white',
      },
    });
  }

  const handleSignUp = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    // If any of the fields are empty, show an alert and return
    if (!name || !email || !phoneNumber || !password) {
      alertIncompleteFields();
      return;
    }

    // If the signup process is already in progress, return
    if (loading) {
      return;
    }

    // Set loading state to true to show "Loading..." on the button
    setLoading(true);

    try {
      // Make signup request
      const response = await axios.post('/api/users/signup', {
        name,
        email,
        phoneNumber,
        password
      });

      // Show success message
      toast.success("User Created Successfully", {
        style: {
          background: 'green',
          color: 'white',
        },
      });

      // Redirect user to login page
      router.push('/login');
    } catch (error: any) {
      // Show error message
      const errorMessage = error.response?.data?.error || 'An error occurred';
      toast(errorMessage, {
        style: {
          background: 'red',
          color: 'white',
        },
      });
    } finally {
      // Reset loading state to false after signup process completes (whether success or failure)
      setLoading(false);
    }
  }

  return (
    <div className='flex flex-col h-screen'>
      <div className='pt-4 items-center justify-center flex italic text-2xl font-bold tracking-tight'>
        <div
          className="text-4xl font-bold italic tracking-tight"
          style={{
            background: "linear-gradient(to right, #5082EE, #D76572)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Lecturify +
        </div>
      </div>
      <DarkModeButton />
      <div className='flex-1 flex items-center justify-center'>
        <div>
          <Card className="w-[350px] border-[rgb(61,68,77)] dark:bg-[#212628]">
            <CardHeader className='flex items-center justify-center'>
              <CardTitle className='text-lg'>User Signup</CardTitle>
              <CardDescription>Welcome to Turfify</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="name" value={name} className="border-[rgb(61,68,77)] dark:bg-[#0F0F0F]" onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" placeholder="Email" value={email} className="border-[rgb(61,68,77)] dark:bg-[#0F0F0F]" onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <PhoneInput id="phoneNumber" value={phoneNumber || ''} className="border-[rgb(61,68,77)] dark:bg-[#0F0F0F]" onChange={(value) => setPhoneNumber(value || '')} placeholder="Enter a phone number" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} id="password" className="border-[rgb(61,68,77)] dark:bg-[#0F0F0F]" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                      <button type="button" onClick={togglePasswordVisibility} className="absolute top-1/2 right-3 transform -translate-y-1/2 focus:outline-none">
                        {showPassword ? <FaRegEye /> : <FaEyeSlash />}
                      </button>
                    </div>
                  </div>
                  <div className="items-top flex space-x-2">
                    <Checkbox id="terms1" />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms1"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Accept terms and conditions
                      </label>
                      <p className="text-[10px] text-muted-foreground">
                        You agree to our Terms of Service and Privacy Policy.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <Button className='px-20' onClick={handleSignUp}>
                      {loading ? "Loading..." : "SignUp"}
                    </Button>
                  </div>
                  <div className='mx-auto flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>or</div>
                  <p className='text-sm'>If you already have an account, please&nbsp;
                    <Link className='text-blue-500 text-sm hover:underline' href='/login'>Login</Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className='mb-4'>
      <CopyRight/>
      </div>
    </div>
  );
}

export default SignupU;
