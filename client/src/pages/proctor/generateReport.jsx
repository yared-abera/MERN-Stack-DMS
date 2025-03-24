import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProctorBlocks } from '@/store/blockSlice/index';
import { getAllocatedStudent } from "../../store/studentAllocation/allocateSlice";
import { FaFileDownload, FaFilePdf, FaFileExcel, FaPrint } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';

export default function ProctorGenerateReport() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const { list: blocks } = useSelector((state) => state.block);
  const [selectedReport, setSelectedReport] = useState('all');
  const [selectedBlock, setSelectedBlock] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchProctorBlocks()).unwrap();
      } catch (error) {
        console.error("Failed to fetch blocks:", error);
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

  const getFilteredStudents = () => {
    let filtered = students;
    
    if (selectedBlock !== 'all') {
      filtered = filtered.filter(student => student.blockNum === selectedBlock);
    }
    
    switch (selectedReport) {
      case 'registered':
        return filtered.filter(student => student.status === 'Registered');
      case 'unregistered':
        return filtered.filter(student => student.status !== 'Registered');
      default:
        return filtered;
    }
  };

  const handleGenerateReport = (format) => {
    const filteredStudents = getFilteredStudents();
    const reportTitle = `Student_Report_${selectedBlock}_${selectedReport}_${new Date().toISOString().split('T')[0]}`;

    switch (format) {
      case 'pdf':
        generatePDF(filteredStudents, reportTitle);
        break;
      case 'excel':
        generateExcel(filteredStudents, reportTitle);
        break;
      case 'print':
        window.print();
        break;
      default:
        console.log('Invalid format');
    }
  };

  const generatePDF = (data, title) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(title.replace(/_/g, ' '), 14, 15);
    
    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

    // Define the columns for the table
    const columns = [
      { header: 'Student ID', dataKey: 'userName' },
      { header: 'Name', dataKey: 'fullName' },
      { header: 'Block', dataKey: 'blockNum' },
      { header: 'Room', dataKey: 'dormId' },
      { header: 'Status', dataKey: 'status' }
    ];

    // Prepare the data
    const tableData = data.map(student => ({
      userName: student.userName,
      fullName: `${student.Fname} ${student.Lname}`,
      blockNum: `Block ${student.blockNum}`,
      dormId: student.dormId || 'Not Assigned',
      status: student.status || 'Not Registered'
    }));

    // Generate the table
    doc.autoTable({
      columns: columns,
      body: tableData,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    // Save the PDF
    doc.save(`${title}.pdf`);
  };

  const generateExcel = (data, title) => {
    // Prepare the data
    const excelData = data.map(student => ({
      'Student ID': student.userName,
      'Name': `${student.Fname} ${student.Lname}`,
      'Block': `Block ${student.blockNum}`,
      'Room': student.dormId || 'Not Assigned',
      'Status': student.status || 'Not Registered',
      'Registration Date': student.registrationDate || 'N/A',
      'Phone': student.phone || 'N/A',
      'Email': student.email || 'N/A',
      'Emergency Contact': student.emergencyContact || 'N/A',
      'Parent Name': student.parentName || 'N/A',
      'Parent Phone': student.parentPhone || 'N/A',
      'Address': student.address || 'N/A'
    }));

    // Create worksheet
    const ws = utils.json_to_sheet(excelData);

    // Create workbook
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Students');

    // Generate Excel file
    writeFile(wb, `${title}.xlsx`);
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
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Generate Reports</h1>
          <p className="text-gray-600">
            Generate reports for Block{blocks.length > 1 ? 's' : ''} {blocks.map(block => block.blockNum).join(', ')}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Block
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
              >
                <option value="all">All Blocks</option>
                {blocks.map((block) => (
                  <option key={block.blockNum} value={block.blockNum}>
                    Block {block.blockNum}
                  </option>
                ))}
              </select>
            </div>
    <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
              >
                <option value="all">All Students</option>
                <option value="registered">Registered Students</option>
                <option value="unregistered">Unregistered Students</option>
              </select>
            </div>
          </div>
        </div>

        {/* Report Preview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Report Preview</h2>
            <div className="flex gap-4">
              <button
                onClick={() => handleGenerateReport('pdf')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <FaFilePdf /> PDF
              </button>
              <button
                onClick={() => handleGenerateReport('excel')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <FaFileExcel /> Excel
              </button>
              <button
                onClick={() => handleGenerateReport('print')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FaPrint /> Print
              </button>
            </div>
          </div>

          {/* Preview Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Block
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredStudents().map((student, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{student.userName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {`${student.Fname} ${student.Lname}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Block {student.blockNum}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.dormId || 'Not Assigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        student.status === 'Registered' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {student.status || 'Not Registered'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
