"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import axios from 'axios';
import Loader from '../loader/page';
interface NavProps {
  showSearchBar: boolean;
  userDetails: any;
  userRole: any;
  loading: any,
}


const Nav: React.FC<NavProps> = ({ showSearchBar, userDetails, userRole, loading }) => {
  const [darkMode, setDarkMode] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const router = useRouter();

  useEffect(() => {
    const rootElement = document.documentElement;

    if (darkMode) {
      rootElement.classList.add('dark');
    } else {
      rootElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (!loading && window.google && !autoCompleteRef.current && inputRef.current) {
      autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["(cities)"],
          componentRestrictions: { country: "in" },
          fields: ["name"],
        }
      );
    }
  }, [loading]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const loginredirect = () => {
    router.push('/login');
  };
  const joinredirect = () => {
    router.push('/signup')
  }
  const profileredirect = () => {
    router.push('/profile')
  }
  const homeredirect = () => {
    router.push('/')
  }
  const bookingredirect = () => {
    router.push('/booking')
  }
  const myturfredirect = () => {
    router.push('/myturf')
  }
  const logout = async () => {
    try {
      await axios.get('/api/users/logout')

      localStorage.removeItem('token');

      toast.success('Logout successful', {
        style: {
          background: 'green',
          color: 'white',
        },
      });
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.map((word) => word[0]).join('').toUpperCase();
  };

  if (loading) {
    return <div className='flex h-screen justify-center items-center'><Loader /></div>;
  }

  if (userRole === "user") {
    return (
      <div className="relative z-50">
        <div
          className="fixed top-4 left-[2%] right-[2%] bg-[#FFFFFF] dark:bg-[#212628] rounded-2xl shadow-lg"
          style={{ isolation: "isolate" }} // Prevent parent styles from affecting children
        >
          <div className="h-16 flex justify-between items-center rounded-10xl">
            <div
              className="ml-4 mr-4 italic text-3xl font-bold tracking-tight"
              style={{
                background: "linear-gradient(to right, #5082EE, #D76572)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text", // For non-Webkit browsers
                color: "transparent",  // Ensure the text is fully transparent
                zIndex: 10, // Ensure it renders above other styles
              }}
            >
              Lecturify +
            </div>

            <div className="flex items-center space-x-2 mr-4">
              {/* show when user is logged. starting point */}
              <div className="mr-1">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarFallback className="text-lg">
                        {getInitials(userDetails.name)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="border-black dark:border-white mt-2">
                    <DropdownMenuSeparator className="bg-black" />
                    <DropdownMenuItem
                      className="flex items-center justify-center dark:border-white/70 font-medium border border-gray-200 rounded-lg"
                      onClick={homeredirect}
                    >
                      Home
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-black" />
                    <DropdownMenuItem
                      className="flex items-center justify-center dark:border-white/70 font-medium border border-gray-200 rounded-lg"
                      onClick={profileredirect}
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-black" />
                    <DropdownMenuItem
                      className="flex items-center justify-center dark:border-white/70 font-medium border border-gray-200 rounded-lg"
                      onClick={bookingredirect}
                    >
                      My Bookings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-black" />
                    <DropdownMenuItem
                      className="flex items-center justify-center text-white font-medium bg-red-500 border-gray-200 border"
                      onClick={logout}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* show when user is logged. ending point */}
              <div>
                <label className="theme-switch">
                  <input
                    type="checkbox"
                    className="theme-switch__checkbox"
                    checked={darkMode}
                    onChange={toggleDarkMode}
                  />
                  <div className="theme-switch__container">
                    <div className="theme-switch__clouds"></div>
                    <div className="theme-switch__stars-container">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 144 55"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="..."
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                    <div className="theme-switch__circle-container">
                      <div className="theme-switch__sun-moon-container">
                        <div className="theme-switch__moon">
                          <div className="theme-switch__spot"></div>
                          <div className="theme-switch__spot"></div>
                          <div className="theme-switch__spot"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
  else if (userRole === "admin") {
    return (
      <div className='h-14 relative z-50'>
        <div className={`fixed bg-white dark:bg-[#171717] top-0 left-0 right-0 ${darkMode && "dark"}`}>
          <div className='h-14 border-b border-black dark:border-white flex justify-between items-center'>
            <div className='ml-4 mr-4 italic text-2xl font-bold tracking-tight'>
              Lecturify
            </div>
            <div className='flex items-center space-x-2 mr-4'>
              {/* show when user is logged. starting point  */}
              <div className='mr-1'>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarFallback className='text-lg'>{getInitials(userDetails.name)}</AvatarFallback>
                    </Avatar></DropdownMenuTrigger>
                  <DropdownMenuContent className='border-black dark:border-white mt-2'>
                    <DropdownMenuSeparator className='bg-black ' />
                    <DropdownMenuItem className='flex items-center  justify-center dark:border-white/70 font-medium border border=gray-200 rounded-lg' onClick={homeredirect}>Home</DropdownMenuItem>
                    <DropdownMenuSeparator className='bg-black' />
                    <DropdownMenuItem className='flex items-center  justify-center dark:border-white/70 font-medium border border=gray-200 rounded-lg' onClick={profileredirect}>Profile</DropdownMenuItem>
                    <DropdownMenuSeparator className='bg-black' />
                    <DropdownMenuItem className='flex items-center  justify-center dark:border-white/70 font-medium border border=gray-200 rounded-lg' onClick={myturfredirect}>My Turf</DropdownMenuItem>
                    <DropdownMenuSeparator className='bg-black' />
                    <DropdownMenuItem className='flex items-center justify-center text-white font-medium bg-red-500 border-gray-200 border ' onClick={logout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* show when user is logged. ending point  */}
              <div>
                <label className="theme-switch">
                  <input type="checkbox" className="theme-switch__checkbox" checked={darkMode} onChange={toggleDarkMode} />
                  <div className="theme-switch__container">
                    <div className="theme-switch__clouds"></div>
                    <div className="theme-switch__stars-container">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z" fill="currentColor"></path>
                      </svg>
                    </div>
                    <div className="theme-switch__circle-container">
                      <div className="theme-switch__sun-moon-container">
                        <div className="theme-switch__moon">
                          <div className="theme-switch__spot"></div>
                          <div className="theme-switch__spot"></div>
                          <div className="theme-switch__spot"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='h-14 relative z-50'>
        <div className={`fixed top-0 bg-white dark:bg-[#171717] left-0 right-0 ${darkMode && "dark"}`}>
          <div className='h-14 border-b border-black dark:border-white flex justify-between items-center'>
            <div className='ml-4 mr-4 italic text-2xl font-bold tracking-tight'>
              TURFIFY
            </div>
            <div className='relative'>
              <FaLocationCrosshairs className='absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-gray-400 text-black' />
              <Input style={{ border: darkMode ? '1px solid white' : '1px solid black' }} className='pl-10 w-[50vw]' ref={inputRef} placeholder='Search for locations' />
            </div>
            <div className='flex items-center space-x-2 mr-4'>
              <Button onClick={loginredirect} className='px-[2vw] ml-2 mr-2' variant="default">Login</Button>
              <Button onClick={joinredirect} className='px-[2vw] ml-2 mr-2' variant="default">Sign Up</Button>
              <div>
                <label className="theme-switch">
                  <input type="checkbox" className="theme-switch__checkbox" checked={darkMode} onChange={toggleDarkMode} />
                  <div className="theme-switch__container">
                    <div className="theme-switch__clouds"></div>
                    <div className="theme-switch__stars-container">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z" fill="currentColor"></path>
                      </svg>
                    </div>
                    <div className="theme-switch__circle-container">
                      <div className="theme-switch__sun-moon-container">
                        <div className="theme-switch__moon">
                          <div className="theme-switch__spot"></div>
                          <div className="theme-switch__spot"></div>
                          <div className="theme-switch__spot"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

};


export default Nav;