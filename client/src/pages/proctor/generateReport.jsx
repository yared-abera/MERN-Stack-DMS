import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProctorBlocks } from '@/store/blockSlice/index';
import { getAllocatedStudent } from "../../store/studentAllocation/allocateSlice";
import { FaFileDownload, FaFilePdf, FaFileExcel, FaPrint } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';
import axios from 'axios';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Printer, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllControlIssues } from "@/store/control/controlSclice";
import { getAttendanceNotification } from "@/store/attendance/attendance-Slice";

export default function GenerateReport() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState({
    blocks: true,
    maintenance: true,
    students: true,
    control: true
  });
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [maintenanceIssues, setMaintenanceIssues] = useState([]);
  const { list: blocks } = useSelector((state) => state.block);
  const [selectedBlock, setSelectedBlock] = useState('all');
  const [activeTab, setActiveTab] = useState('students');
  const [selectedSections, setSelectedSections] = useState({
    students: true,
    maintenance: false,
    control: false,
    dorms: false,
    attendance: false,
  });
  const { allIssues } = useSelector((state) => state.control);
  const { absentStudent } = useSelector((state) => state.attendance);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching blocks and maintenance issues...');
        await dispatch(fetchProctorBlocks()).unwrap();
        console.log('Blocks fetched successfully');
        
        const issuesResponse = await axios.get('http://localhost:9000/api/maintainanceIssue/getWhole', {
          withCredentials: true
        });
        console.log('Maintenance issues fetched successfully');
        setMaintenanceIssues(issuesResponse.data);
        setLoading(prev => ({ ...prev, blocks: false, maintenance: false }));
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        setError(error.message);
        setLoading(prev => ({ ...prev, blocks: false, maintenance: false }));
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (blocks.length === 0) {
        console.log('No blocks available, skipping student fetch');
        setLoading(prev => ({ ...prev, students: false }));
        return;
      }
      
      try {
        console.log('Fetching allocated students...');
        const response = await dispatch(getAllocatedStudent()).unwrap();
        console.log('Students fetched successfully:', response);
        if (response.data) {
          const proctorStudents = response.data.filter((student) =>
            blocks.some((block) => block.blockNum === student.blockNum)
          );
          setStudents(proctorStudents);
        }
        setLoading(prev => ({ ...prev, students: false }));
      } catch (error) {
        console.error("Failed to fetch students:", error);
        setError(error.message);
        setLoading(prev => ({ ...prev, students: false }));
      }
    };

    fetchStudents();
  }, [blocks, dispatch]);

  useEffect(() => {
    const fetchControlAndAttendance = async () => {
      try {
        console.log('Fetching control issues and attendance...');
        const [controlResponse, attendanceResponse] = await Promise.all([
          dispatch(getAllControlIssues()),
          dispatch(getAttendanceNotification())
        ]);
        console.log('Control Response:', controlResponse);
        console.log('Attendance Response:', attendanceResponse);
        console.log('Attendance Data in Store:', absentStudent);
        setLoading(prev => ({ ...prev, control: false }));
      } catch (error) {
        console.error("Failed to fetch control/attendance:", error);
        setError(error.message);
        setLoading(prev => ({ ...prev, control: false }));
      }
    };
    
    fetchControlAndAttendance();
  }, [dispatch]);

  // Add a new useEffect to monitor absentStudent changes
  useEffect(() => {
    console.log('Current absentStudent data:', absentStudent);
  }, [absentStudent]);

  // Check if any loading state is true
  const isLoading = Object.values(loading).some(state => state === true);

  const getFilteredStudents = () => {
    if (selectedBlock === 'all') {
      return students;
    }
    return students.filter(student => student.blockNum === selectedBlock);
  };

  const getFilteredIssues = () => {
    if (selectedBlock === 'all') {
      return maintenanceIssues;
    }
    // Filter by block number (string comparison for robustness)
    return maintenanceIssues.filter(issue => 
      String(issue.blockNum || issue.block) === String(selectedBlock)
    );
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 15;
    
    doc.setFontSize(12);
    doc.text(`Block: ${selectedBlock === 'all' ? 'All Blocks' : 'Block ' + selectedBlock}`, 14, y);
    y += 10;
    doc.text(`Generated on: ${new Date().toLocaleString('en-US', {
      year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
    })}`, 14, y);
    y += 10;

    // Students Section
    if (selectedSections.students) {
      doc.setFontSize(14);
      doc.text('Students', 14, y);
      y += 8;
      autoTable(doc, {
        startY: y,
        head: [['Student ID Name', 'Block', 'Room', 'Status', 'Phone', 'Email', 'Emergency Contact', 'Parent Contact']],
        body: getFilteredStudents().map(student => [
          `${student.userName}/${student.Fname} ${student.Lname}`,
          `Block ${student.blockNum}`,
          student.dormId || '3',
          student.status ? 'Registered' : 'Not Registered',
          student.phoneNum || 'N/A',
          `${student.userName.toLowerCase()}@example.com`,
          student.emergencyContactNumber || 'N/A',
          student.parentPhone ? `${student.parentFirstName} ${student.parentLastName}\n${student.parentPhone}` : 'N/A'
        ]),
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 10, fontStyle: 'bold' },
        bodyStyles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: y }
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    // Maintenance Section
    if (selectedSections.maintenance) {
      doc.setFontSize(14);
      doc.text('Maintenance Issues', 14, y);
      y += 8;
      autoTable(doc, {
        startY: y,
        head: [['First Name', 'Middle Name', 'Last Name', 'User Name', 'Block', 'Room', 'Issue Types', 'Status', 'Date Reported']],
        body: getFilteredIssues().flatMap(issue =>
          (issue.issueTypes && Array.isArray(issue.issueTypes) && issue.issueTypes.length > 0
            ? issue.issueTypes
            : [null]
          ).map(type => [
          issue.firstName || issue.userInfo?.fName || '',
          issue.middleName || issue.userInfo?.mName || '',
          issue.lastName || issue.userInfo?.lName || '',
          issue.userName || issue.userInfo?.userName || '',
          `Block ${issue.blockNum || issue.userInfo?.blockNumber}`,
          issue.dormId || issue.userInfo?.roomNumber || '',
            type ? type.issue : '',
            type ? type.status : '',
            type ? (type.dateReported ? new Date(type.dateReported).toLocaleDateString() : '') : (issue.reportedDate ? new Date(issue.reportedDate).toLocaleDateString() : '')
          ])
        ),
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 10, fontStyle: 'bold' },
        bodyStyles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: y }
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    // Control Section
    if (selectedSections.control) {
      doc.setFontSize(14);
      doc.text('Control Issues', 14, y);
      y += 8;
      autoTable(doc, {
        startY: y,
        head: [['Student', 'Block', 'Dorm', 'Issue', 'Status', 'Date', 'Description']],
        body: (allIssues?.data || [])
          .filter(issue => selectedBlock === 'all' || issue.block === selectedBlock)
          .flatMap(issue =>
            (issue.Allissues || []).map(iss => [
              issue.student?.userName || '',
              issue.block || '',
              issue.dorm || '',
              iss.issue || '',
              iss.status || '',
              iss.dateReported ? new Date(iss.dateReported).toLocaleDateString() : '',
              iss.description || ''
            ])
          ),
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 10, fontStyle: 'bold' },
        bodyStyles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: y }
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    // Dorms Section
    if (selectedSections.dorms) {
      doc.setFontSize(14);
      doc.text('Dorms', 14, y);
      y += 8;
      autoTable(doc, {
        startY: y,
        head: [['Block', 'Dorm Number', 'Capacity', 'Status']],
        body: blocks
          .filter(b => selectedBlock === 'all' || b.blockNum === selectedBlock)
          .flatMap(b => (b.floors || []).flatMap(f => (f.dorms || []).map(d => [
            `Block ${b.blockNum}`,
            d.dormNumber,
            d.capacity,
            d.dormStatus
          ]))),
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 10, fontStyle: 'bold' },
        bodyStyles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: y }
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    // Attendance Section
    if (selectedSections.attendance) {
      doc.setFontSize(14);
      doc.text('Attendance (Absences)', 14, y);
      y += 8;
      autoTable(doc, {
        startY: y,
        head: [['Student Name', 'Student ID', 'Block', 'Dorm', 'Absent Date']],
        body: (absentStudent?.data || [])
          .filter(student => selectedBlock === 'all' || String(student.block) === String(selectedBlock))
          .map(student => [
            `${student.student?.Fname || ''} ${student.student?.Lname || ''}`,
            student.student?.userName || '',
            `Block ${student.block || ''}`,
            student.student?.dormId || 'N/A',
            new Date().toLocaleDateString()
          ]),
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 10, fontStyle: 'bold' },
        bodyStyles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: y }
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    doc.save(`block_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateExcel = () => {
    const wb = utils.book_new();

    // Students Sheet
    if (selectedSections.students) {
      const studentsData = getFilteredStudents().map(student => ({
        'Student ID Name': `${student.userName}/${student.Fname} ${student.Lname}`,
        'Block': `Block ${student.blockNum}`,
        'Room': student.dormId || '3',
        'Status': student.status ? 'Registered' : 'Not Registered',
        'Phone': student.phoneNum || 'N/A',
        'Email': `${student.userName.toLowerCase()}@example.com`,
        'Emergency Contact': student.emergencyContactNumber || 'N/A',
        'Parent Contact': student.parentPhone ? `${student.parentFirstName} ${student.parentLastName} - ${student.parentPhone}` : 'N/A'
      }));
      const ws = utils.json_to_sheet(studentsData);
      utils.book_append_sheet(wb, ws, 'Students');
    }

    // Maintenance Sheet
    if (selectedSections.maintenance) {
      const issuesData = getFilteredIssues().flatMap(issue =>
        (issue.issueTypes && Array.isArray(issue.issueTypes) && issue.issueTypes.length > 0
          ? issue.issueTypes
          : [null]
        ).map(type => ({
        'First Name': issue.firstName || issue.userInfo?.fName || '',
        'Middle Name': issue.middleName || issue.userInfo?.mName || '',
        'Last Name': issue.lastName || issue.userInfo?.lName || '',
        'User Name': issue.userName || issue.userInfo?.userName || '',
        'Block': `Block ${issue.blockNum || issue.userInfo?.blockNumber}`,
        'Room': issue.dormId || issue.userInfo?.roomNumber || '',
          'Issue Types': type ? type.issue : '',
          'Status': type ? type.status : '',
          'Date Reported': type ? (type.dateReported ? new Date(type.dateReported).toLocaleDateString() : '') : (issue.reportedDate ? new Date(issue.reportedDate).toLocaleDateString() : '')
        }))
      );
      const ws = utils.json_to_sheet(issuesData);
      utils.book_append_sheet(wb, ws, 'Maintenance Issues');
    }

    // Control Sheet
    if (selectedSections.control) {
      const controlData = (allIssues?.data || [])
        .filter(issue => selectedBlock === 'all' || issue.block === selectedBlock)
        .flatMap(issue =>
          (issue.Allissues || []).map(iss => ({
            'Student': issue.student?.userName || '',
            'Block': issue.block || '',
            'Dorm': issue.dorm || '',
            'Issue': iss.issue || '',
            'Status': iss.status || '',
            'Date': iss.dateReported ? new Date(iss.dateReported).toLocaleDateString() : '',
            'Description': iss.description || ''
          }))
        );
      const ws = utils.json_to_sheet(controlData);
      utils.book_append_sheet(wb, ws, 'Control Issues');
    }

    // Dorms Sheet
    if (selectedSections.dorms) {
      const dormsData = blocks
        .filter(b => selectedBlock === 'all' || b.blockNum === selectedBlock)
        .flatMap(b => (b.floors || []).flatMap(f => (f.dorms || []).map(d => ({
          'Block': `Block ${b.blockNum}`,
          'Dorm Number': d.dormNumber,
          'Capacity': d.capacity,
          'Status': d.dormStatus
        }))));
      const ws = utils.json_to_sheet(dormsData);
      utils.book_append_sheet(wb, ws, 'Dorms');
    }

    // Attendance Sheet
    if (selectedSections.attendance) {
      const attendanceData = (absentStudent?.data || [])
        .filter(student => selectedBlock === 'all' || String(student.block) === String(selectedBlock))
        .map(student => ({
          'Student Name': `${student.student?.Fname || ''} ${student.student?.Lname || ''}`,
          'Student ID': student.student?.userName || '',
          'Block': `Block ${student.block || ''}`,
          'Dorm': student.student?.dormId || 'N/A',
          'Absent Date': new Date().toLocaleDateString()
        }));
      const ws = utils.json_to_sheet(attendanceData);
      utils.book_append_sheet(wb, ws, 'Attendance');
    }

    writeFile(wb, `block_report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600 mb-4">Loading...</div>
        <div className="text-sm text-gray-500">
          {loading.blocks && <div>Loading blocks...</div>}
          {loading.maintenance && <div>Loading maintenance issues...</div>}
          {loading.students && <div>Loading students...</div>}
          {loading.control && <div>Loading control and attendance...</div>}
        </div>
        {error && (
          <div className="text-red-500 mt-4">
            Error: {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Generate Reports</h1>
          <div className="mb-6">
            <Select value={selectedBlock} onValueChange={setSelectedBlock}>
              <SelectTrigger>
                <SelectValue placeholder="Select block" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blocks</SelectItem>
                {blocks.map((block) => (
                  <SelectItem key={block.blockNum} value={block.blockNum}>
                    Block {block.blockNum}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            {Object.entries(selectedSections).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => setSelectedSections(s => ({ ...s, [key]: !s[key] }))}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>

            <TabsContent value="students">
              <div className="bg-white rounded-lg">
                <div className="flex justify-end mb-4">
                  <div className="flex gap-4">
                    <Button onClick={generatePDF} variant="destructive">
                      <FileText className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                    <Button onClick={generateExcel} variant="success" className="bg-green-600 hover:bg-green-700">
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Excel
                    </Button>
                    <Button onClick={() => window.print()} variant="default">
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>

                <div className="w-full overflow-x-auto shadow-md rounded-lg" style={{ minWidth: '100%', overflowX: 'auto' }}>
                  <table className="min-w-max w-full table-auto">
                    <thead className="bg-[#2980b9] text-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Student ID Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Block</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Room</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Emergency Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Parent Contact</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getFilteredStudents().map((student, index) => (
                        <tr key={student.userName || index} className={index % 2 === 0 ? 'bg-gray-50 hover:bg-gray-100' : 'bg-white hover:bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {student.userName}/{student.Fname} {student.Lname}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            Block {student.blockNum}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {student.dormId || '3'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              student.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {student.status ? 'Registered' : 'Not Registered'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {student.phoneNum || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {student.userName.toLowerCase()}@example.com
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {student.emergencyContactNumber || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {student.parentPhone ? (
                              <div className="flex flex-col">
                                <span className="font-medium">{student.parentFirstName} {student.parentLastName}</span>
                                <span className="text-gray-500">{student.parentPhone}</span>
                              </div>
                            ) : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attendance">
              <div className="bg-white rounded-lg">
                <div className="flex justify-end mb-4">
                  <div className="flex gap-4">
                    <Button onClick={generatePDF} variant="destructive">
                      <FileText className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                    <Button onClick={generateExcel} variant="success" className="bg-green-600 hover:bg-green-700">
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Excel
                    </Button>
                    <Button onClick={() => window.print()} variant="default">
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>

                <div className="w-full overflow-x-auto shadow-md rounded-lg" style={{ minWidth: '100%', overflowX: 'auto' }}>
                  {loading.control ? (
                    <div className="text-center py-4">Loading attendance data...</div>
                  ) : error ? (
                    <div className="text-center py-4 text-red-500">Error: {error}</div>
                  ) : !absentStudent?.data?.length ? (
                    <div className="text-center py-4">No attendance records found</div>
                  ) : (
                    <table className="min-w-max w-full table-auto">
                      <thead className="bg-[#2980b9] text-white">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Student Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Student ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Block</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Dorm</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Absent Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(absentStudent?.data || [])
                          .filter(student => selectedBlock === 'all' || String(student.block) === String(selectedBlock))
                          .map((student, index) => (
                            <tr key={student.student?._id || index} className={index % 2 === 0 ? 'bg-gray-50 hover:bg-gray-100' : 'bg-white hover:bg-gray-50'}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {student.student?.Fname || ''} {student.student?.Lname || ''}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {student.student?.userName || ''}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                Block {student.block || ''}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {student.student?.dormId || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {new Date().toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add custom scrollbar styling */}
      <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
          height: 10px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 5px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 5px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}
