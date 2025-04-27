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
import { GetWholeMaintainanceIssue } from "@/store/maintenanceIssue/maintenanceIssue";

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
  const { list: blocks } = useSelector((state) => state.block);
  const { wholeMaintainanceIssue } = useSelector((state) => state.issue);
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
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching blocks and maintenance issues...');
        await dispatch(fetchProctorBlocks()).unwrap();
        console.log('Blocks fetched successfully');
        
        await dispatch(GetWholeMaintainanceIssue()).unwrap();
        console.log('Maintenance issues fetched successfully');
        
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
        setLoading(prev => ({ ...prev, control: true }));
        console.log('Fetching attendance data...');
        const attendanceResponse = await dispatch(getAttendanceNotification()).unwrap();
        console.log('Attendance Response:', attendanceResponse);
        setLoading(prev => ({ ...prev, control: false }));
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
        setError(error.message);
        setLoading(prev => ({ ...prev, control: false }));
      }
    };
    
    fetchControlAndAttendance();
  }, [dispatch]);

  useEffect(() => {
    if (selectAll) {
      setSelectedSections({
        students: true,
        maintenance: true,
        control: true,
        dorms: true,
        attendance: true,
      });
    }
  }, [selectAll]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  // Add a new useEffect to monitor absentStudent changes
  useEffect(() => {
    console.log('Current absentStudent data:', absentStudent);
  }, [absentStudent]);

  // Add debug logging for attendance data
  useEffect(() => {
    if (absentStudent?.data) {
      console.log('Current Attendance Data:', absentStudent.data);
    }
  }, [absentStudent]);

  // Check if any loading state is true
  const isLoading = Object.values(loading).some(state => state === true);

  const getFilteredStudents = () => {
    if (selectedBlock === 'all') {
      return students;
    }
    return students.filter(student => student.blockNum === selectedBlock);
  };

  const getFilteredMaintenanceIssues = () => {
    if (!wholeMaintainanceIssue || !Array.isArray(wholeMaintainanceIssue)) {
      return [];
    }
    
    return selectedBlock === 'all' 
      ? wholeMaintainanceIssue
      : wholeMaintainanceIssue.filter(issue => 
          String(issue.blockNum || issue.userInfo?.blockNumber) === String(selectedBlock)
        );
  };

  const getFilteredAttendance = () => {
    if (!absentStudent?.data || !Array.isArray(absentStudent.data)) {
      console.log('No attendance data available');
      return [];
    }

    return absentStudent.data
      .filter(student => selectedBlock === 'all' || String(student.block) === String(selectedBlock))
      .map(record => ({
        firstName: record.student?.Fname || 'N/A',
        middleName: record.student?.mName || 'N/A',
        lastName: record.student?.Lname || 'N/A',
        userName: record.student?.userName || 'N/A',
        block: record.block || 'N/A',
        room: record.student?.dormId || 'N/A',
        absencesCount: record.absencesCount || 1,
        absentDates: record.absentDate ? [new Date(record.absentDate).toLocaleDateString()] : [new Date().toLocaleDateString()]
      }));
  };

  const generatePDF = () => {
    const doc = new jsPDF('landscape');  // Change to landscape for better fit
    let y = 15;
    
    // Add title and date
    doc.setFontSize(16);
    doc.text(`Block: ${selectedBlock === 'all' ? 'All Blocks' : 'Block ' + selectedBlock}`, 14, y);
    y += 10;
    doc.text(`Generated on: ${new Date().toLocaleString('en-US', {
      year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
    })}`, 14, y);
    y += 20;

    // Students Section
    if (selectedSections.students) {
      doc.setFontSize(14);
      doc.text('Students', 14, y);
      y += 8;
      
      const studentsData = getFilteredStudents().map(student => [
        `${student.userName}/${student.Fname} ${student.Lname}`,
        `Block ${student.blockNum}`,
        student.dormId || '3',
        student.status ? 'Registered' : 'Not Registered',
        student.phoneNum || 'N/A',
        `${student.userName.toLowerCase()}@example.com`,
        student.emergencyContactNumber || 'N/A',
        student.parentPhone ? `${student.parentFirstName} ${student.parentLastName}\n${student.parentPhone}` : 'N/A'
      ]);

      autoTable(doc, {
        startY: y,
        head: [['Student ID/Name', 'Block', 'Room', 'Status', 'Phone', 'Email', 'Emergency Contact', 'Parent Contact']],
        body: studentsData,
        headStyles: { 
          fillColor: [41, 128, 185], 
          textColor: 255, 
          fontSize: 10, 
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: { 
          fontSize: 9,
          cellPadding: 3
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 20 },
          2: { cellWidth: 15 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 },
          5: { cellWidth: 35 },
          6: { cellWidth: 30 },
          7: { cellWidth: 40 }
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: y, left: 10, right: 10 },
        theme: 'grid'
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    // Maintenance Section
    if (selectedSections.maintenance) {
      doc.setFontSize(14);
      doc.text('Maintenance Issues', 14, y);
      y += 8;

      const maintenanceTableData = getFilteredMaintenanceIssues()
        .flatMap(issue =>
          (issue.issueTypes && Array.isArray(issue.issueTypes) && issue.issueTypes.length > 0
            ? issue.issueTypes
            : [null]
          ).map(type => [
          issue.middleName || issue.userInfo?.mName || '',
          issue.lastName || issue.userInfo?.lName || '',
          issue.userName || issue.userInfo?.userName || '',
            `Block ${issue.blockNum || issue.userInfo?.blockNumber || ''}`,
          issue.dormId || issue.userInfo?.roomNumber || '',
            type ? type.issue : '',
            type ? (type.dateReported ? new Date(type.dateReported).toLocaleDateString() : '') : 
                  (issue.reportedDate ? new Date(issue.reportedDate).toLocaleDateString() : ''),
            type ? `${type.status} (${type.dateReported ? new Date(type.dateReported).toLocaleDateString() : 'N/A'})` : ''
          ])
        );

      autoTable(doc, {
        startY: y,
        head: [['MIDDLE NAME', 'LAST NAME', 'USER NAME', 'BLOCK', 'ROOM', 'ISSUE TYPES', 'DATE REPORTED', 'STATUS']],
        body: maintenanceTableData,
        headStyles: { 
          fillColor: [41, 128, 185], 
          textColor: 255, 
          fontSize: 10, 
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: { 
          fontSize: 9,
          cellPadding: 3
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 25 },
          2: { cellWidth: 25 },
          3: { cellWidth: 20 },
          4: { cellWidth: 15 },
          5: { cellWidth: 25 },
          6: { cellWidth: 25 },
          7: { cellWidth: 30 }
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: y, left: 10, right: 10 },
        theme: 'grid'
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    // Attendance Section
    if (selectedSections.attendance) {
      doc.setFontSize(14);
      doc.text('Attendance Records', 14, y);
      y += 8;

      const attendanceData = getFilteredAttendance().map(record => [
        record.firstName,
        record.middleName,
        record.lastName,
        record.userName,
        `Block ${record.block}`,
        record.room,
        record.absencesCount.toString(),
        record.absentDates.join(', ')
      ]);

      autoTable(doc, {
        startY: y,
        head: [['First Name', 'Middle Name', 'Last Name', 'Student ID', 'Block', 'Room', 'Absences', 'Absent Dates']],
        body: attendanceData,
        headStyles: { 
          fillColor: [41, 128, 185], 
          textColor: 255, 
          fontSize: 10, 
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: { 
          fontSize: 9,
          cellPadding: 3
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 25 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { cellWidth: 20 },
          5: { cellWidth: 15 },
          6: { cellWidth: 15 },
          7: { cellWidth: 30 }
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: y, left: 10, right: 10 },
        theme: 'grid'
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    // Control Section
    if (selectedSections.control) {
      doc.setFontSize(14);
      doc.text('Control Issues', 14, y);
      y += 8;

      const controlData = (allIssues?.data || [])
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
        );

      autoTable(doc, {
        startY: y,
        head: [['STUDENT', 'BLOCK', 'DORM', 'ISSUE', 'STATUS', 'DATE', 'DESCRIPTION']],
        body: controlData,
        headStyles: { 
          fillColor: [41, 128, 185], 
          textColor: 255, 
          fontSize: 10, 
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: { 
          fontSize: 9,
          cellPadding: 3
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 30 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
          6: { cellWidth: 40 }
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: y, left: 10, right: 10 },
        theme: 'grid'
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    // Dorms Section
    if (selectedSections.dorms) {
      doc.setFontSize(14);
      doc.text('Dorms', 14, y);
      y += 8;

      const dormsData = blocks
          .filter(b => selectedBlock === 'all' || b.blockNum === selectedBlock)
          .flatMap(b => (b.floors || []).flatMap(f => (f.dorms || []).map(d => [
            `Block ${b.blockNum}`,
            d.dormNumber,
            d.capacity,
            d.dormStatus
        ])));

      autoTable(doc, {
        startY: y,
        head: [['BLOCK', 'DORM NUMBER', 'CAPACITY', 'STATUS']],
        body: dormsData,
        headStyles: { 
          fillColor: [41, 128, 185], 
          textColor: 255, 
          fontSize: 10, 
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: { 
          fontSize: 9,
          cellPadding: 3
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 40 },
          2: { cellWidth: 40 },
          3: { cellWidth: 40 }
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: y, left: 10, right: 10 },
        theme: 'grid'
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
        'STUDENT ID/NAME': `${student.userName}/${student.Fname} ${student.Lname}`,
        'BLOCK': `Block ${student.blockNum}`,
        'ROOM': student.dormId || '3',
        'STATUS': student.status ? 'Registered' : 'Not Registered',
        'PHONE': student.phoneNum || 'N/A',
        'EMAIL': `${student.userName.toLowerCase()}@example.com`,
        'EMERGENCY CONTACT': student.emergencyContactNumber || 'N/A',
        'PARENT CONTACT': student.parentPhone ? `${student.parentFirstName} ${student.parentLastName} - ${student.parentPhone}` : 'N/A'
      }));
      const ws = utils.json_to_sheet(studentsData);
      utils.book_append_sheet(wb, ws, 'Students');
      ws['!cols'] = [
        { wch: 30 }, // STUDENT ID/NAME
        { wch: 15 }, // BLOCK
        { wch: 10 }, // ROOM
        { wch: 15 }, // STATUS
        { wch: 15 }, // PHONE
        { wch: 25 }, // EMAIL
        { wch: 20 }, // EMERGENCY CONTACT
        { wch: 35 }  // PARENT CONTACT
      ];
    }

    // Maintenance Sheet
    if (selectedSections.maintenance) {
      const maintenanceData = getFilteredMaintenanceIssues()
        .flatMap(issue =>
        (issue.issueTypes && Array.isArray(issue.issueTypes) && issue.issueTypes.length > 0
          ? issue.issueTypes
          : [null]
        ).map(type => ({
            'MIDDLE NAME': issue.middleName || issue.userInfo?.mName || '',
            'LAST NAME': issue.lastName || issue.userInfo?.lName || '',
            'USER NAME': issue.userName || issue.userInfo?.userName || '',
            'BLOCK': `Block ${issue.blockNum || issue.userInfo?.blockNumber || ''}`,
            'ROOM': issue.dormId || issue.userInfo?.roomNumber || '',
            'ISSUE TYPES': type ? type.issue : '',
            'DATE REPORTED': type ? (type.dateReported ? new Date(type.dateReported).toLocaleDateString() : '') : 
                           (issue.reportedDate ? new Date(issue.reportedDate).toLocaleDateString() : ''),
            'STATUS': type ? `${type.status} (${type.dateReported ? new Date(type.dateReported).toLocaleDateString() : 'N/A'})` : ''
        }))
      );
      const ws = utils.json_to_sheet(maintenanceData);
      utils.book_append_sheet(wb, ws, 'Maintenance Issues');
      ws['!cols'] = [
        { wch: 15 }, // MIDDLE NAME
        { wch: 15 }, // LAST NAME
        { wch: 15 }, // USER NAME
        { wch: 12 }, // BLOCK
        { wch: 8 },  // ROOM
        { wch: 20 }, // ISSUE TYPES
        { wch: 15 }, // DATE REPORTED
        { wch: 25 }  // STATUS
      ];
    }

    // Attendance Sheet
    if (selectedSections.attendance) {
      const attendanceData = getFilteredAttendance().map(record => ({
        'FIRST NAME': record.firstName,
        'MIDDLE NAME': record.middleName,
        'LAST NAME': record.lastName,
        'STUDENT ID': record.userName,
        'BLOCK': `Block ${record.block}`,
        'ROOM': record.room,
        'ABSENCES COUNT': record.absencesCount,
        'ABSENT DATES': record.absentDates.join(', ')
      }));

      const ws = utils.json_to_sheet(attendanceData);
      utils.book_append_sheet(wb, ws, 'Attendance');
      ws['!cols'] = [
        { wch: 15 }, // FIRST NAME
        { wch: 15 }, // MIDDLE NAME
        { wch: 15 }, // LAST NAME
        { wch: 15 }, // STUDENT ID
        { wch: 12 }, // BLOCK
        { wch: 8 },  // ROOM
        { wch: 10 }, // ABSENCES COUNT
        { wch: 30 }  // ABSENT DATES
      ];
    }

    // Control Sheet
    if (selectedSections.control) {
      const controlData = (allIssues?.data || [])
        .filter(issue => selectedBlock === 'all' || issue.block === selectedBlock)
        .flatMap(issue =>
          (issue.Allissues || []).map(iss => ({
            'STUDENT': issue.student?.userName || '',
            'BLOCK': issue.block || '',
            'DORM': issue.dorm || '',
            'ISSUE': iss.issue || '',
            'STATUS': iss.status || '',
            'DATE': iss.dateReported ? new Date(iss.dateReported).toLocaleDateString() : '',
            'DESCRIPTION': iss.description || ''
          }))
        );
      const ws = utils.json_to_sheet(controlData);
      utils.book_append_sheet(wb, ws, 'Control Issues');
      ws['!cols'] = [
        { wch: 15 }, // STUDENT
        { wch: 12 }, // BLOCK
        { wch: 8 },  // DORM
        { wch: 20 }, // ISSUE
        { wch: 15 }, // STATUS
        { wch: 15 }, // DATE
        { wch: 30 }  // DESCRIPTION
      ];
    }

    // Dorms Sheet
    if (selectedSections.dorms) {
      const dormsData = blocks
        .filter(b => selectedBlock === 'all' || b.blockNum === selectedBlock)
        .flatMap(b => (b.floors || []).flatMap(f => (f.dorms || []).map(d => ({
          'BLOCK': `Block ${b.blockNum}`,
          'DORM NUMBER': d.dormNumber,
          'CAPACITY': d.capacity,
          'STATUS': d.dormStatus
        }))));
      const ws = utils.json_to_sheet(dormsData);
      utils.book_append_sheet(wb, ws, 'Dorms');
      ws['!cols'] = [
        { wch: 15 }, // BLOCK
        { wch: 15 }, // DORM NUMBER
        { wch: 12 }, // CAPACITY
        { wch: 15 }  // STATUS
      ];
    }

    writeFile(wb, `block_report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const renderAttendanceTable = () => {
    const attendanceData = getFilteredAttendance();

    if (loading.control) {
      return <div className="text-center py-4">Loading attendance data...</div>;
    }

    if (error) {
      return <div className="text-center py-4 text-red-500">Error: {error}</div>;
    }

    if (!attendanceData.length) {
      return <div className="text-center py-4">No attendance records found</div>;
    }

    return (
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#2980b9] text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">First Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Middle Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Last Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Student ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Block</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Room</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Absences Count</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Absent Dates</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {attendanceData.map((record, index) => (
            <tr key={`${record.userName}-${index}`} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.firstName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.middleName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.lastName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.userName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Block {record.block}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.room}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.absencesCount}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.absentDates.join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
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

          <div className="flex flex-col gap-4 mb-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="form-checkbox h-4 w-4 text-blue-600"
                id="selectAll"
              />
              <label htmlFor="selectAll" className="text-sm font-medium">
                Select All Sections
              </label>
            </div>
            
            <div className="flex flex-wrap gap-4">
            {Object.entries(selectedSections).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={value}
                    onChange={() => {
                      setSelectedSections(s => ({ ...s, [key]: !s[key] }));
                      setSelectAll(false);
                    }}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
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

                <div className="w-full overflow-x-auto shadow-md rounded-lg">
                  {renderAttendanceTable()}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="maintenance">
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
                  {loading.maintenance ? (
                    <div className="text-center py-4">Loading maintenance issues...</div>
                  ) : error ? (
                    <div className="text-center py-4 text-red-500">Error: {error}</div>
                  ) : !getFilteredMaintenanceIssues().length ? (
                    <div className="text-center py-4">No maintenance issues found</div>
                  ) : (
                    <table className="min-w-max w-full table-auto">
                      <thead className="bg-[#2980b9] text-white">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">MIDDLE NAME</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">LAST NAME</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">USER NAME</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">BLOCK</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">ROOM</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">ISSUE TYPES</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">DATE REPORTED</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getFilteredMaintenanceIssues()
                          .flatMap(issue =>
                            (issue.issueTypes && Array.isArray(issue.issueTypes) && issue.issueTypes.length > 0
                              ? issue.issueTypes
                              : [null]
                            ).map((type, typeIndex) => (
                              <tr key={`${issue._id}-${typeIndex}`} className={typeIndex % 2 === 0 ? 'bg-gray-50 hover:bg-gray-100' : 'bg-white hover:bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  {issue.middleName || issue.userInfo?.mName || ''}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  {issue.lastName || issue.userInfo?.lName || ''}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  {issue.userName || issue.userInfo?.userName || ''}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  Block {issue.blockNum || issue.userInfo?.blockNumber || ''}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  {issue.dormId || issue.userInfo?.roomNumber || ''}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  {type ? type.issue : ''}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  {type ? (type.dateReported ? new Date(type.dateReported).toLocaleDateString() : '') : 
                                   (issue.reportedDate ? new Date(issue.reportedDate).toLocaleDateString() : '')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    type?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    type?.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {type ? `${type.status} (${type.dateReported ? new Date(type.dateReported).toLocaleDateString() : 'N/A'})` : ''}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
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
