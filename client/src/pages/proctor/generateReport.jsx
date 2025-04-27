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
  const [loading, setLoading] = useState(true);
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
        await dispatch(fetchProctorBlocks()).unwrap();
        // Fetch maintenance issues
        const issuesResponse = await axios.get('/api/maintenance/issues');
        setMaintenanceIssues(issuesResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (blocks.length === 0) return;
      
      try {
        const response = await dispatch(getAllocatedStudent()).unwrap();
        if (response.data) {
          const proctorStudents = response.data.filter((student) =>
            blocks.some((block) => block.blockNum === student.blockNum)
          );
          setStudents(proctorStudents);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [blocks, dispatch]);

  useEffect(() => {
    dispatch(getAllControlIssues());
    dispatch(getAttendanceNotification());
  }, [dispatch]);

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
        head: [['Student ID Name', 'Block', 'Room', 'Status', 'Phone', 'Email', 'Emergency Contact']],
        body: getFilteredStudents().map(student => [
          `${student.userName}/${student.Fname} ${student.Lname}`,
          `Block ${student.blockNum}`,
          student.dormId || '3',
          'Not Registered',
          'N/A',
          `${student.userName.toLowerCase()}@example.com`,
          'N/A'
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
        head: [['Student', 'Block', 'Absence Dates']],
        body: (absentStudent?.data || [])
          .filter(a => selectedBlock === 'all' || a.block === selectedBlock)
          .map(a => [
            a.student?.userName || '',
            a.block || '',
            Array.isArray(a.student?.absenceDates)
              ? a.student.absenceDates.map(date => new Date(date).toLocaleDateString()).join(', ')
              : ''
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
        'Status': 'Not Registered',
        'Phone': 'N/A',
        'Email': `${student.userName.toLowerCase()}@example.com`,
        'Emergency Contact': 'N/A'
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
        .filter(a => selectedBlock === 'all' || a.block === selectedBlock)
        .map(a => ({
          'Student': a.student?.userName || '',
          'Block': a.block || '',
          'Absence Dates': Array.isArray(a.student?.absenceDates)
            ? a.student.absenceDates.map(date => new Date(date).toLocaleDateString()).join(', ')
            : ''
        }));
      const ws = utils.json_to_sheet(attendanceData);
      utils.book_append_sheet(wb, ws, 'Attendance');
    }

    writeFile(wb, `block_report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
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

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#2980b9] text-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Student ID Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Block</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Room</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Emergency Contact</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getFilteredStudents().map((student, index) => (
                        <tr key={student.userName || index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
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
                            Not Registered
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            N/A
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {student.userName.toLowerCase()}@example.com
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            N/A
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
