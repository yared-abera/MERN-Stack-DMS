import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProctorBlocks } from '@/store/blockSlice/index';
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
import { FileText, FileSpreadsheet, Printer, Eye } from "lucide-react";

export default function MaintenanceReport() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [maintenanceIssues, setMaintenanceIssues] = useState([]);
  const { list: blocks } = useSelector((state) => state.block);
  const [selectedBlock, setSelectedBlock] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchProctorBlocks()).unwrap();
        const response = await axios.get('/api/maintenance/issues');
        setMaintenanceIssues(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const getFilteredIssues = () => {
    if (selectedBlock === 'all') {
      return maintenanceIssues;
    }
    return maintenanceIssues.filter(issue => issue.blockNum === selectedBlock);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const filteredData = getFilteredIssues();
    
    // Add title and metadata
    doc.setFontSize(12);
    doc.text(`Block: ${selectedBlock === 'all' ? 'All Blocks' : 'Block ' + selectedBlock}`, 14, 15);
    doc.text(`Generated on: ${new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })}`, 14, 25);

    // Generate maintenance issues table
    autoTable(doc, {
      startY: 35,
      head: [['First Name', 'Middle Name', 'Last Name', 'User Name', 'Block', 'Room', 'Issue Types', 'Date Reported']],
      body: filteredData.map(issue => [
        issue.firstName || '',
        issue.middleName || '',
        issue.lastName || '',
        issue.userName,
        `Block ${issue.blockNum}`,
        issue.dormId || '',
        `View Issues (${issue.issueCount || 1})`,
        new Date(issue.reportedDate).toLocaleDateString()
      ]),
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 35 }
    });

    doc.save(`maintenance_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateExcel = () => {
    const wb = utils.book_new();
    const filteredData = getFilteredIssues();

    const issuesData = filteredData.map(issue => ({
      'First Name': issue.firstName || '',
      'Middle Name': issue.middleName || '',
      'Last Name': issue.lastName || '',
      'User Name': issue.userName,
      'Block': `Block ${issue.blockNum}`,
      'Room': issue.dormId || '',
      'Issue Types': `View Issues (${issue.issueCount || 1})`,
      'Date Reported': new Date(issue.reportedDate).toLocaleDateString()
    }));

    const ws = utils.json_to_sheet(issuesData);
    utils.book_append_sheet(wb, ws, 'Maintenance Issues');
    writeFile(wb, `maintenance_report_${new Date().toISOString().split('T')[0]}.xlsx`);
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
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Maintenance Issues Report</h1>
          
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

          <div className="flex justify-end gap-4 mb-6">
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

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#2980b9] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">First Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Middle Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Last Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">User Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Block</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Issue Types</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Date Reported</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">View Detail</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredIssues().map((issue, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{issue.firstName || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{issue.middleName || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{issue.lastName || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{issue.userName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Block {issue.blockNum}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{issue.dormId || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button variant="link" className="p-0 h-auto font-normal text-blue-600">
                        View Issues ({issue.issueCount || 1})
                      </Button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(issue.reportedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
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