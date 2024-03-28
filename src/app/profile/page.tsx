"use client"
import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from 'sonner';
import LogoutButton from "@/components/logoutbutton/page";
import Loader from "@/components/loader/page";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Nav from "@/components/navbar/page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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


export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState<any>(null);
    const [userRole, setUserRole] = useState("");
    const [date, setDate] = useState<Date>();
    const [editableName, setEditableName] = useState("");
    const [gender, setGender] = useState("");
    const [currentPassword, setCurrentPassword] = useState(""); // State variable for current password
    const [newPassword, setNewPassword] = useState(""); // State variable for new password
    const [updating, setUpdating] = useState(false); // State to track if password is being updated

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/users/me');
                const { data } = response.data;
                setUserDetails(data);
                setUserRole(data.role);
                setDate(data.dateOfBirth);
                setEditableName(data.name);
                setGender(data.gender);
                setLoading(false);
            } catch (error) {
                expirylogout();
                router.push('/login');
            }
        }
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            fetchUserData();
        }
    }, [router]);

    const expirylogout = async () => {
        try {
            await axios.get('/api/users/logout');
            localStorage.removeItem('token');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

    const loginredirect = () => {
        router.push('/login');
    }

    const handleUpdateDetails = async () => {
        if (updating) return;
        try {
            setUpdating(true);
            const updatedUser = {
                email: userDetails.email, // Add the email to the request payload
                name: editableName,
                gender: gender,
                dateOfBirth: date
            };
            await axios.put('/api/users/update', updatedUser);
            toast.success("User details updated successfully", {
                style: {
                    background: 'green',
                    color: 'white',
                },
            });
            window.location.reload();
        } catch (error) {
            toast.error("Failed to update user details", {
                style: {
                    background: 'red',
                    color: 'white',
                },
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (updating) return;
        try {
            setUpdating(true);
            const data = {
                email: userDetails.email,
                currentPassword: currentPassword,
                newPassword: newPassword
            };
            await axios.post('/api/users/updatePassword', data);
            toast.success("Password updated successfully", {
                style: {
                    background: 'green',
                    color: 'white',
                },
            });
            setNewPassword(""); // Clear new password input after successful update
        } catch (error: any) {
            toast.error(error.response.data.error, {
                style: {
                    background: 'red',
                    color: 'white',
                },
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleGenderChange = (value: string) => {
        setGender(value);
    };

    const getInitials = (name: string) => {
        const names = name.split(' ');
        return names.map((word) => word[0]).join('').toUpperCase();
    };

    if (!userDetails) {
        return <div className="flex items-center justify-center h-screen">
            <Loader />
        </div>;
    }

    if (userRole === "user") {
        return (
            <div className="h-screen">
                <div>
                    <Nav loading={loading} userRole={userRole} userDetails={userDetails} showSearchBar={false} />
                </div>
                <div className="flex h-[86.8%]">
                    <div className="flex-col flex w-1/4 items-center pt-10">
                        <Avatar className="h-40 w-40">
                            <AvatarFallback className='text-7xl'>{getInitials(userDetails.name)}</AvatarFallback>
                        </Avatar>
                        <p className="text-3xl pt-2 font-normal">{userDetails.name}</p>
                        <p>{userDetails.phoneNumber}</p>
                    </div>
                    <div>
                        <Separator orientation="vertical" />
                    </div>
                    <div className="flex w-3/4">
                        <div className="w-[100%]">
                            <div className="font-normal ml-4 my-4 text-3xl">General Account Settings</div>
                            <Separator />
                            <div className="w-[80%] ml-4 mt-2">
                                <div className="p-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        type="text"
                                        className="border-black dark:border-white"
                                        id="name"
                                        placeholder="Name"
                                        value={editableName}
                                        onChange={(e) => setEditableName(e.target.value)}
                                    />
                                </div>
                                <div className="flex">
                                    <div className="p-2 w-1/2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input type="email" id="email" className="border-black dark:border-white" value={userDetails.email} readOnly />
                                    </div>
                                    <div className="p-2 w-1/2">
                                        <Label htmlFor="email">Gender</Label>
                                        <Select
                                            value={gender}
                                            onValueChange={handleGenderChange}
                                        >
                                            <SelectTrigger className="w-full border-black dark:border-white">
                                                <SelectValue>{gender ? gender : 'Select Gender'}</SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="male">Male</SelectItem>
                                                    <SelectItem value="female">Female</SelectItem>
                                                    <SelectItem value="others">Others</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="w-1/2 p-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input type="text" id="phoneNumber" className="border-black dark:border-white" value={userDetails.phoneNumber} readOnly />
                                    </div>
                                    <div className="w-1/2 p-2">
                                        <Label htmlFor="datefobirth">Date Of Birth</Label>
                                        <br />
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full border-black dark:border-white justify-start text-left font-normal",
                                                        !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4 text-black dark:text-white" />
                                                    {date ? format(date, "PPP") : <span className="text-black">Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    captionLayout="dropdown-buttons"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    fromYear={1960}
                                                    toYear={2030}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <div className="p-2 pb-3">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button>Update Details</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will update your profile details
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleUpdateDetails} disabled={updating}>Update</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <div className="font-normal ml-4 mt-2 text-3xl">Update Password</div>
                                <div className="px-4 pt-1">
                                    <div className=" p-2 w-1/3">
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <Input type="password" id="currentPassword" className="border-black dark:border-white" placeholder="Old Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                                    </div>
                                    <div className="w-1/3 p-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input type="password" id="newPassword" className="border-black dark:border-white" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                    </div>
                                    <div className="px-2 pt-2">
                                        <Button onClick={handleUpdatePassword} disabled={updating}>Update Password</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-10 pt-2 border-t border-black dark:border-white flex items-center justify-center">© 2024 Turfify. All rights reserved.</div>
            </div>
        );
    } else if (userRole === "admin") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <h2>Welcome Admin</h2>
                <p>Name: {userDetails.name}</p>
                <p>Email: {userDetails.email}</p>
                <p>Phone Number: {userDetails.phoneNumber}</p>
                <LogoutButton />
            </div>
        );
    } else if (userRole === "turf") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <h2>Welcome Turf</h2>
                <p>Name: {userDetails.name}</p>
                <p>Email: {userDetails.email}</p>
                <p>Phone Number: {userDetails.phoneNumber}</p>
                <LogoutButton />
            </div>
        );
    } else {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <div>There is an issue, please login again</div>
                <LogoutButton />
                <Button variant='outline' onClick={loginredirect}>Login</Button>
            </div>
        );
    }
}
