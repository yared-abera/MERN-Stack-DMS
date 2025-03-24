import React from 'react'
   import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
export default function ProctorViewInfo() {

 const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sample student data
  const students = [
    {
      id: "WKU123456",
      name: "Yared Abera",
      department: "Computer Science",
      year: "3rd Year",
      email: "yared.abera@example.com",
      phone: "+251 96 818 8616",
      status: "Active",
      avatar: "https://via.placeholder.com/150",
    },
    {
      id: "WKU123457",
      name: "Liya Mekonnen",
      department: "Information Technology",
      year: "2nd Year",
      email: "liya.mekonnen@example.com",
      phone: "+251 91 234 5678",
      status: "Inactive",
      avatar: "https://via.placeholder.com/150",
    },
    {
      id: "WKU123458",
      name: "Samuel Tesfaye",
      department: "Software Engineering",
      year: "4th Year",
      email: "samuel.tesfaye@example.com",
      phone: "+251 97 654 3210",
      status: "Active",
      avatar: "https://via.placeholder.com/150",
    },
  ];

  return (
     <>
      <h2 className="text-2xl font-bold mb-4">Student Information</h2>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <Card key={student.id} className="shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold">{student.name}</CardTitle>
                <p className="text-gray-500">{student.department} - {student.year}</p>
              </div>
              <Badge variant="outline" className="ml-auto">{student.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <p><strong>ID:</strong> {student.id}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Phone:</strong> {student.phone}</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Edit</Button>
                <Button variant="destructive">Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
 
