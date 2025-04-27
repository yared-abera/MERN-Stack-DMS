import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProctorBlocks } from '@/store/blockSlice/index';
import { getAllocatedStudent } from "../../store/studentAllocation/allocateSlice";
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
import { FileText, FileSpreadsheet, Printer, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function BlockReport() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [maintenanceIssues, setMaintenanceIssues] = useState([]);
  const { list: blocks } = useSelector((state) => state.block);
  const [selectedBlock, setSelectedBlock] = useState('all');
  const [blockStats, setBlockStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchProctorBlocks()).unwrap();
        const [studentsRes, issuesRes] = await Promise.all([
          dispatch(getAllocatedStudent()).unwrap(),
          axios.get('/api/maintenance/issues')
        ]);

        setStudents(studentsRes.data || []);
        setMaintenanceIssues(issuesRes.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    // Calculate block statistics
    const stats = blocks.reduce((acc, block) => {
      const blockStudents = students.filter(s => s.blockNum === block.blockNum);
      const blockIssues = maintenanceIssues.filter(i => i.blockNum === block.blockNum);
      
      acc[block.blockNum] = {
        capacity: block.capacity || 112,
        allocated: blockStudents.length,
        available: (block.capacity || 112) - blockStudents.length,
        dorms: block.totalRooms || 19,
        occupancyRate: Math.round((blockStudents.length / (block.capacity || 112)) * 100),
        maintenanceCount: blockIssues.length,
        availableRooms: block.availableRooms || 18,
        fullRooms: block.fullRooms || 1,
        unavailableRooms: block.unavailableRooms || 0,
        underMaintenance: blockIssues.length
      };
      return acc;
    }, {});
    setBlockStats(stats);
  }, [blocks, students, maintenanceIssues]);

  const generatePDF = () => {
    const doc = new jsPDF();
    const currentBlock = selectedBlock === 'all' ? null : selectedBlock;
    
    // Add title and metadata
    doc.setFontSize(16);
    doc.text(`Block ${currentBlock || 'All'} Report`, 14, 15);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })}`, 14, 25);

    let yOffset = 35;

    // Add block statistics if specific block is selected
    if (currentBlock && blockStats[currentBlock]) {
      const stats = blockStats[currentBlock];
      doc.setFontSize(14);
      doc.text(`Block ${currentBlock} Statistics`, 14, yOffset);
      yOffset += 10;

      doc.setFontSize(10);
      const statsText = [
        `Capacity: ${stats.capacity}`,
        `Allocated: ${stats.allocated}`,
        `Available: ${stats.available}`,
        `Occupancy Rate: ${stats.occupancyRate}%`,
        `Total Rooms: ${stats.dorms}`,
        `Available Rooms: ${stats.availableRooms}`,
        `Full Rooms: ${stats.fullRooms}`,
        `Under Maintenance: ${stats.underMaintenance}`
      ];

      statsText.forEach(text => {
        doc.text(text, 20, yOffset);
        yOffset += 6;
      });

      yOffset += 10;
    }

    // Add student table
    const filteredStudents = selectedBlock === 'all' 
      ? students 
      : students.filter(s => s.blockNum === selectedBlock);

    autoTable(doc, {
      startY: yOffset,
      head: [['Student ID Name', 'Block', 'Room', 'Status', 'Phone', 'Email', 'Emergency Contact']],
      body: filteredStudents.map(student => [
        `${student.userName}/${student.Fname} ${student.Lname}`,
        `Block ${student.blockNum}`,
        student.dormId || '3',
        'Not Registered',
        'N/A',
        `${student.userName.toLowerCase()}@example.com`,
        'N/A'
      ]),
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    // Add maintenance issues if they exist
    const filteredIssues = selectedBlock === 'all'
      ? maintenanceIssues
      : maintenanceIssues.filter(i => i.blockNum === selectedBlock);

    if (filteredIssues.length > 0) {
      doc.addPage();
      doc.setFontSize(14);
      doc.text('Maintenance Issues', 14, 15);

      autoTable(doc, {
        startY: 25,
        head: [['Issue Type', 'Room', 'Status', 'Priority', 'Reported Date', 'Description']],
        body: filteredIssues.map(issue => [
          issue.type || 'General',
          issue.dormId || '',
          issue.status || 'Pending',
          issue.priority || 'Medium',
          new Date(issue.reportedDate).toLocaleDateString(),
          issue.description || ''
        ]),
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });
    }

    doc.save(`block_report_${selectedBlock}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateExcel = () => {
    const wb = utils.book_new();
    const currentBlock = selectedBlock === 'all' ? null : selectedBlock;

    // Add block statistics sheet if specific block is selected
    if (currentBlock && blockStats[currentBlock]) {
      const stats = blockStats[currentBlock];
      const statsData = [
        ['Block Statistics'],
        ['Metric', 'Value'],
        ['Capacity', stats.capacity],
        ['Allocated', stats.allocated],
        ['Available', stats.available],
        ['Occupancy Rate', `${stats.occupancyRate}%`],
        ['Total Rooms', stats.dorms],
        ['Available Rooms', stats.availableRooms],
        ['Full Rooms', stats.fullRooms],
        ['Under Maintenance', stats.underMaintenance]
      ];
      const ws_stats = utils.aoa_to_sheet(statsData);
      utils.book_append_sheet(wb, ws_stats, 'Block Statistics');
    }

    // Add students sheet
    const filteredStudents = selectedBlock === 'all'
      ? students
      : students.filter(s => s.blockNum === selectedBlock);

    const studentsData = filteredStudents.map(student => ({
      'Student ID Name': `${student.userName}/${student.Fname} ${student.Lname}`,
      'Block': `Block ${student.blockNum}`,
      'Room': student.dormId || '3',
      'Status': 'Not Registered',
      'Phone': 'N/A',
      'Email': `${student.userName.toLowerCase()}@example.com`,
      'Emergency Contact': 'N/A'
    }));

    const ws_students = utils.json_to_sheet(studentsData);
    utils.book_append_sheet(wb, ws_students, 'Students');

    // Add maintenance issues sheet
    const filteredIssues = selectedBlock === 'all'
      ? maintenanceIssues
      : maintenanceIssues.filter(i => i.blockNum === selectedBlock);

    if (filteredIssues.length > 0) {
      const issuesData = filteredIssues.map(issue => ({
        'Issue Type': issue.type || 'General',
        'Room': issue.dormId || '',
        'Status': issue.status || 'Pending',
        'Priority': issue.priority || 'Medium',
        'Reported Date': new Date(issue.reportedDate).toLocaleDateString(),
        'Description': issue.description || ''
      }));

      const ws_issues = utils.json_to_sheet(issuesData);
      utils.book_append_sheet(wb, ws_issues, 'Maintenance Issues');
    }

    writeFile(wb, `block_report_${selectedBlock}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const currentBlockStats = selectedBlock !== 'all' ? blockStats[selectedBlock] : null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Block Report</h1>
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

          <div className="mb-8">
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

          {currentBlockStats && (
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Block {selectedBlock}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <div className="flex justify-between text-sm">
                        <span>Capacity:</span>
                        <span className="font-medium">{currentBlockStats.capacity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Allocated:</span>
                        <span className="font-medium">{currentBlockStats.allocated}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Available:</span>
                        <span className="font-medium">{currentBlockStats.available}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Occupancy Rate:</span>
                          <span className="font-medium">{currentBlockStats.occupancyRate}%</span>
                        </div>
                        <Progress value={currentBlockStats.occupancyRate} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Rooms Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Rooms:</span>
                        <span className="font-medium">{currentBlockStats.dorms}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Available:</span>
                        <span className="font-medium text-green-600">{currentBlockStats.availableRooms}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Full:</span>
                        <span className="font-medium text-blue-600">{currentBlockStats.fullRooms}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Under Maintenance:</span>
                        <span className="font-medium text-yellow-600">{currentBlockStats.underMaintenance}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Student Information</h2>
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
                    {(selectedBlock === 'all' ? students : students.filter(s => s.blockNum === selectedBlock))
                      .map((student, index) => (
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

            {maintenanceIssues.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Maintenance Issues</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#2980b9] text-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Issue Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Room</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Reported Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Description</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(selectedBlock === 'all' 
                        ? maintenanceIssues 
                        : maintenanceIssues.filter(i => i.blockNum === selectedBlock)
                      ).map((issue, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{issue.type || 'General'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{issue.dormId || ''}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${issue.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                                issue.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                                'bg-yellow-100 text-yellow-800'}`}>
                              {issue.status || 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${issue.priority === 'High' ? 'bg-red-100 text-red-800' : 
                                issue.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-green-100 text-green-800'}`}>
                              {issue.priority || 'Medium'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {new Date(issue.reportedDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {issue.description || ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 