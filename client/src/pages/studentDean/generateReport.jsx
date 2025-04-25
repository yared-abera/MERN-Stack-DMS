import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBlock } from '@/store/blockSlice';
import { getAllocatedStudent } from "@/store/studentAllocation/allocateSlice";
import { FaFileDownload, FaFilePdf, FaFileExcel, FaPrint } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StudentInfoChart from "@/components/studentDean/indexGraph";

export default function StudentDeanGenerateReport() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const { list: blocks } = useSelector((state) => state.block);
  const [selectedReport, setSelectedReport] = useState('all');
  const [selectedBlock, setSelectedBlock] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getAllBlock()).unwrap();
      } catch (error) {
        console.error("Failed to fetch blocks:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await dispatch(getAllocatedStudent()).unwrap();
        if (response.data) {
          setStudents(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [dispatch]);

  const getFilteredStudents = () => {
    let filtered = students;
    
    if (selectedBlock !== 'all') {
      filtered = filtered.filter(student => student.blockNum === selectedBlock);
    }
    
    switch (selectedReport) {
      case 'regular':
        return filtered.filter(student => 
          student.isDisable !== "YES" && student.isSpecial !== "YES"
        );
      case 'disabled':
        return filtered.filter(student => student.isDisable === "YES");
      case 'special':
        return filtered.filter(student => student.isSpecial === "YES");
      case 'fresh':
        return filtered.filter(student => student.studCategory === "Fresh");
      case 'senior':
        return filtered.filter(student => student.studCategory === "Senior");
      case 'remedial':
        return filtered.filter(student => student.studCategory === "Remedial");
      default:
        return filtered;
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const filteredStudents = getFilteredStudents();
    const stats = calculateStatistics(filteredStudents);
    const title = `Student Report - ${selectedBlock === 'all' ? 'All Blocks' : 'Block ' + selectedBlock}`;
    
    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    
    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

    // Add statistics
    doc.setFontSize(12);
    doc.text('Student Statistics', 14, 35);
    doc.setFontSize(10);
    doc.text(`Total Students: ${stats.total}`, 14, 45);
    doc.text(`Male Students: ${stats.male}`, 14, 55);
    doc.text(`Female Students: ${stats.female}`, 14, 65);

    // Define the columns for the table
    const columns = [
      { header: 'ID', dataKey: 'userName' },
      { header: 'Name', dataKey: 'fullName' },
      { header: 'Gender', dataKey: 'sex' },
      { header: 'Block', dataKey: 'blockNum' },
      { header: 'Dorm', dataKey: 'dormId' }
    ];

    // Prepare the data
    const tableData = filteredStudents.map(student => ({
      userName: student.userName,
      fullName: `${student.Fname} ${student.Lname}`,
      sex: student.sex?.toUpperCase() || 'N/A',
      blockNum: student.blockNum || 'N/A',
      dormId: student.dormId || 'Not Assigned'
    }));

    // Generate the table using autoTable
    autoTable(doc, {
      head: [columns.map(col => col.header)],
      body: tableData.map(row => columns.map(col => row[col.dataKey])),
      startY: 75,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    // Save the PDF
    try {
      doc.save(`student_report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error saving PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const generateExcel = () => {
    const filteredStudents = getFilteredStudents();
    
    // Prepare the data - Simplified
    const excelData = filteredStudents.map(student => ({
      'ID': student.userName,
      'Name': `${student.Fname} ${student.Lname}`,
      'Gender': student.sex?.toUpperCase() || 'N/A',
      'Block': student.blockNum || 'N/A',
      'Dorm': student.dormId || 'Not Assigned'
    }));

    // Create worksheet
    const ws = utils.json_to_sheet(excelData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Students');

    // Generate Excel file
    writeFile(wb, `student_report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const calculateStatistics = (data) => {
    return {
      total: data.length,
      male: data.filter(s => s.sex?.toUpperCase() === "MALE").length,
      female: data.filter(s => s.sex?.toUpperCase() === "FEMALE").length,
      regular: data.filter(s => s.isDisable !== "YES" && s.isSpecial !== "YES").length,
      disabled: data.filter(s => s.isDisable === "YES").length,
      special: data.filter(s => s.isSpecial === "YES").length
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const stats = calculateStatistics(getFilteredStudents());

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Generate Reports</h1>
          <p className="text-gray-600">
            Generate student reports and statistics
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Student Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">Total Students: {stats.total}</p>
              <p className="mt-2">Male: {stats.male}</p>
              <p>Female: {stats.female}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Regular: {stats.regular}</p>
              <p>Disabled: {stats.disabled}</p>
              <p>Special: {stats.special}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Generate Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select value={selectedBlock} onValueChange={setSelectedBlock}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Block" />
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

                <Select value={selectedReport} onValueChange={setSelectedReport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Report Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="regular">Regular Students</SelectItem>
                    <SelectItem value="disabled">Disabled Students</SelectItem>
                    <SelectItem value="special">Special Students</SelectItem>
                    <SelectItem value="fresh">Fresh Students</SelectItem>
                    <SelectItem value="senior">Senior Students</SelectItem>
                    <SelectItem value="remedial">Remedial Students</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 flex items-center gap-2"
                    onClick={generatePDF}
                  >
                    <FaFilePdf />
                    PDF
                  </Button>
                  <Button 
                    className="flex-1 flex items-center gap-2"
                    onClick={generateExcel}
                  >
                    <FaFileExcel />
                    Excel
                  </Button>
                  <Button 
                    className="flex-1 flex items-center gap-2"
                    onClick={() => window.print()}
                  >
                    <FaPrint />
                    Print
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Student Distribution</h2>
          <StudentInfoChart data={getFilteredStudents()} />
        </div>

      </div>
    </div>
  );
} 