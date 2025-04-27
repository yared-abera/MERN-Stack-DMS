import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBlock } from '@/store/blockSlice';
import { getAllocatedStudent } from "@/store/studentAllocation/allocateSlice";
import { FaFileDownload, FaFilePdf, FaFileExcel, FaPrint, FaChartBar, FaUsers, FaBuilding, FaTools, FaExclamationTriangle } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import StudentInfoChart from "@/components/studentDean/indexGraph";
import { getDormStatistics } from "@/store/dormSlice/index";
import { getAllUser } from "@/store/user-slice/userSlice";
import { GetWholeMaintainanceIssue } from "@/store/maintenanceIssue/maintenanceIssue";
import { getAllControlIssues } from "@/store/control/controlSclice";

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function StudentDeanGenerateReport() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const { list: blocks } = useSelector((state) => state.block);
  const [selectedReport, setSelectedReport] = useState('all');
  const [selectedBlock, setSelectedBlock] = useState('all');
  
  // Statistics states
  const [proctorSummary, setProctorSummary] = useState({ 
    total: 0, 
    names: [],
    proctors: []
  });
  
  const [blockSummary, setBlockSummary] = useState([]);
  
  const [dormSummary, setDormSummary] = useState({
    total: 0,
    available: 0,
    full: 0,
    maintenance: 0,
    unavailable: 0
  });
  
  const [maintenanceSummary, setMaintenanceSummary] = useState({ 
    total: 0, 
    pending: 0, 
    resolved: 0, 
    inProgress: 0, 
    verified: 0 
  });
  
  const [controlsSummary, setControlsSummary] = useState({ 
    total: 0, 
    open: 0, 
    closed: 0, 
    inProgress: 0, 
    passed: 0 
  });
  
  // Selectors for additional data
  const { AllBlock } = useSelector((state) => state.block);
  const { isLoading: proctorLoading, AllUser } = useSelector((state) => state.allUser);
  const { statistics: dormStats } = useSelector((state) => state.dorm);
  const { isLoading: maintenanceLoading, wholeMaintainanceIssue } = useSelector((state) => state.issue || {});
  const { allIssues = [] } = useSelector((state) => state.control || {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getAllBlock()).unwrap();
        await dispatch(getAllUser()).unwrap();
        await dispatch(getDormStatistics()).unwrap();
        await dispatch(GetWholeMaintainanceIssue()).unwrap();
        await dispatch(getAllControlIssues()).unwrap();
      } catch (error) {
        console.error("Failed to fetch data:", error);
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
  
  // Calculate proctor statistics
  useEffect(() => {
    if (AllUser && AllUser.success && Array.isArray(AllUser.data) && 
        AllBlock && AllBlock.success && Array.isArray(AllBlock.data)) {
      const filteredProctors = AllUser.data.filter(data => data.role === 'proctor');
      
      // Create a mapping of proctor IDs to assigned blocks
      const proctorBlockMapping = {};
      
      // Loop through blocks to find proctor assignments
      AllBlock.data.forEach(block => {
        if (block.blockNum && block.assignedProctor) {
          if (typeof block.assignedProctor === 'string') {
            proctorBlockMapping[block.assignedProctor] = `Block ${block.blockNum}`;
          } else if (block.assignedProctor._id) {
            proctorBlockMapping[block.assignedProctor._id] = `Block ${block.blockNum}`;
          }
        }
      });
      
      setProctorSummary({
        total: filteredProctors.length,
        names: filteredProctors.map(p => `${p.fName} ${p.lName}`),
        proctors: filteredProctors.map(p => {
          let blockInfo = 'N/A';
          
          if (proctorBlockMapping[p._id]) {
            blockInfo = proctorBlockMapping[p._id];
          } else if (p.blockNum) {
            blockInfo = `Block ${p.blockNum}`;
          }
          
          return {
            name: `${p.fName} ${p.lName}`,
            id: p._id,
            email: p.email || 'N/A',
            phone: p.phoneNum || 'N/A',
            block: blockInfo,
            gender: p.sex || 'N/A',
            position: 'Proctor'
          };
        })
      });
    }
  }, [AllUser, AllBlock]);
  
  // Calculate block statistics
  useEffect(() => {
    if (AllBlock && AllBlock.success && Array.isArray(AllBlock.data)) {
      const blockStats = AllBlock.data.map(block => {
        // Calculate capacity and occupancy based on dorms
        let capacity = 0;
        let occupied = 0;
        let availableRooms = 0;
        let fullRooms = 0;
        let underMaintenance = 0;
        let totalDorms = 0;
        
        if (Array.isArray(block.floors)) {
          block.floors.forEach(floor => {
            if (Array.isArray(floor.dorms)) {
              totalDorms += floor.dorms.length;
              
              floor.dorms.forEach(dorm => {
                capacity += dorm.capacity || 0;
                occupied += dorm.studentsAllocated || 0;
                
                const status = dorm.dormStatus?.toLowerCase() || '';
                if (status.includes('available')) {
                  availableRooms++;
                } else if (status.includes('unavailable') || status.includes('full')) {
                  fullRooms++;
                } else if (status.includes('maintenance')) {
                  underMaintenance++;
                }
              });
            }
          });
        }
        
        const occupancyRate = capacity > 0 ? Math.round((occupied / capacity) * 100) : 0;
        
        return {
          block: `Block ${block.blockNum}`,
          capacity: capacity,
          occupied: occupied,
          available: capacity - occupied,
          occupancyRate: `${occupancyRate}%`,
          dorms: totalDorms,
          availableRooms: availableRooms,
          fullRooms: fullRooms,
          underMaintenance: underMaintenance
        };
      });
      
      setBlockSummary(blockStats);
    }
  }, [AllBlock]);
  
  // Calculate dorm statistics
  useEffect(() => {
    if (dormStats) {
      setDormSummary({
        total: dormStats.totalDorms || 0,
        available: dormStats.availableDorms || 0,
        full: dormStats.usedDorms || 0,
        maintenance: dormStats.maintenanceDorms || 0,
        unavailable: dormStats.totalDorms - dormStats.availableDorms - dormStats.maintenanceDorms || 0
      });
    } else if (AllBlock && AllBlock.success && Array.isArray(AllBlock.data)) {
      let totalDorms = 0, available = 0, full = 0, maintenance = 0, unavailable = 0;
      
      AllBlock.data.forEach(block => {
        if (Array.isArray(block.floors)) {
          block.floors.forEach(floor => {
            if (Array.isArray(floor.dorms)) {
              totalDorms += floor.dorms.length;
              
              floor.dorms.forEach(dorm => {
                const status = dorm.dormStatus?.toLowerCase() || '';
                
                if (status.includes('available')) {
                  available++;
                } else if (status.includes('full')) {
                  full++;
                } else if (status.includes('maintenance')) {
                  maintenance++;
                } else if (status.includes('unavailable')) {
                  unavailable++;
                }
              });
            }
          });
        }
      });
      
      setDormSummary({
        total: totalDorms,
        available: available,
        full: full,
        maintenance: maintenance,
        unavailable: unavailable
      });
    }
  }, [dormStats, AllBlock]);
  
  // Calculate maintenance issues statistics
  useEffect(() => {
    if (wholeMaintainanceIssue && Array.isArray(wholeMaintainanceIssue)) {
      let total = wholeMaintainanceIssue.length;
      let pending = 0, resolved = 0, inProgress = 0, verified = 0;
      
      wholeMaintainanceIssue.forEach(issue => {
        const status = issue.status?.toLowerCase() || '';
        
        if (status.includes('pending')) {
          pending++;
        } else if (status.includes('resolved')) {
          resolved++;
        } else if (status.includes('progress')) {
          inProgress++;
        } else if (status.includes('verified')) {
          verified++;
        }
      });
      
      setMaintenanceSummary({
        total: total,
        pending: pending,
        resolved: resolved,
        inProgress: inProgress,
        verified: verified
      });
    }
  }, [wholeMaintainanceIssue]);
  
  // Calculate control issues statistics
  useEffect(() => {
    if (allIssues && Array.isArray(allIssues)) {
      let total = allIssues.length;
      let open = 0, closed = 0, inProgress = 0, passed = 0;
      
      allIssues.forEach(issue => {
        const status = issue.status?.toLowerCase() || '';
        
        if (status.includes('open')) {
          open++;
        } else if (status.includes('closed')) {
          closed++;
        } else if (status.includes('progress')) {
          inProgress++;
        } else if (status.includes('passed')) {
          passed++;
        }
      });
      
      setControlsSummary({
        total: total,
        open: open,
        closed: closed,
        inProgress: inProgress,
        passed: passed
      });
    }
  }, [allIssues]);

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
    let y = 10;
    
    // Add title
    doc.setFontSize(16);
    doc.text('Comprehensive DMS Report', 14, y);
    y += 10;
    
    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, y);
    y += 10;

    // Add report type
    doc.setFontSize(12);
    doc.text(`Report Type: ${selectedReport === 'all' ? 'All Students' : 
      selectedReport === 'regular' ? 'Regular Students' :
      selectedReport === 'disabled' ? 'Disabled Students' :
      selectedReport === 'special' ? 'Special Students' :
      selectedReport === 'fresh' ? 'Fresh Students' :
      selectedReport === 'senior' ? 'Senior Students' :
      selectedReport === 'remedial' ? 'Remedial Students' : 'Unknown'
    }`, 14, y);
    y += 10;

    // Student Statistics Section
    doc.setFontSize(14);
    doc.text('Student Statistics', 14, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(`Total Students: ${stats.total}`, 14, y);
    y += 6;
    doc.text(`Male: ${stats.male}, Female: ${stats.female}`, 14, y);
    y += 6;
    doc.text(`Regular: ${stats.regular}, Disabled: ${stats.disabled}, Special: ${stats.special}`, 14, y);
    y += 10;
    
    // Student Statistics by Block
    doc.setFontSize(14);
    doc.text('Student Distribution by Block', 14, y);
    y += 8;
    
    // Get student distribution by block
    const blockDistribution = {};
    filteredStudents.forEach(student => {
      const blockNum = student.blockNum || 'Unassigned';
      blockDistribution[blockNum] = (blockDistribution[blockNum] || 0) + 1;
    });
    
    // Create a table of block distribution
    const blockRows = Object.keys(blockDistribution).map(blockNum => [
      blockNum === 'Unassigned' ? 'Unassigned' : `Block ${blockNum}`,
      blockDistribution[blockNum],
      ((blockDistribution[blockNum] / stats.total) * 100).toFixed(1) + '%'
    ]);
    
    autoTable(doc, {
      startY: y,
      head: [['Block', 'Students', 'Percentage']],
      body: blockRows,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      margin: { left: 10, right: 10 },
    });
    y = doc.lastAutoTable.finalY + 10;
    
    // Proctor Statistics Section
    doc.setFontSize(14);
    doc.text('Proctor Statistics', 14, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(`Total Proctors: ${proctorSummary.total}`, 14, y);
    y += 10;
    
    // Blocks Section
    doc.setFontSize(14);
    doc.text('Block Statistics', 14, y);
    y += 8;
    autoTable(doc, {
      startY: y,
      head: [['Block', 'Capacity', 'Occupied', 'Available', 'Occupancy Rate']],
      body: blockSummary.map(b => [
        b.block, 
        b.capacity, 
        b.occupied, 
        b.available, 
        b.occupancyRate
      ]),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      margin: { left: 10, right: 10 },
    });
    y = doc.lastAutoTable.finalY + 10;

    // Dorms Section
    doc.setFontSize(14);
    doc.text('Dorm Statistics', 14, y);
    y += 8;
    autoTable(doc, {
      startY: y,
      head: [['Status', 'Count']],
      body: [
        ['Total Dorms', dormSummary.total],
        ['Available', dormSummary.available],
        ['Full', dormSummary.full],
        ['Under Maintenance', dormSummary.maintenance],
        ['Unavailable', dormSummary.unavailable]
      ],
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      margin: { left: 10, right: 10 },
    });
    y = doc.lastAutoTable.finalY + 10;

    // Maintenance Issues Section
    doc.setFontSize(14);
    doc.text('Maintenance Issues', 14, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(`Total Issues: ${maintenanceSummary.total}`, 14, y);
    y += 6;
    doc.text(`Pending: ${maintenanceSummary.pending}, Resolved: ${maintenanceSummary.resolved}, In Progress: ${maintenanceSummary.inProgress}, Verified: ${maintenanceSummary.verified}`, 14, y);
    y += 10;

    // Controls Section
    doc.setFontSize(14);
    doc.text('Control Issues', 14, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(`Total Controls: ${controlsSummary.total}`, 14, y);
    y += 6;
    doc.text(`Open: ${controlsSummary.open}, Closed: ${controlsSummary.closed}, In Progress: ${controlsSummary.inProgress}, Passed: ${controlsSummary.passed}`, 14, y);

    // Save the PDF
    try {
      doc.save(`comprehensive_report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error saving PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const generateExcel = () => {
    const wb = utils.book_new();
    const filteredStudents = getFilteredStudents();
    const stats = calculateStatistics(filteredStudents);
    
    // 1. Student Statistics Sheet
    const statsData = [
      ['Comprehensive DMS Report'],
      [`Generated on: ${new Date().toLocaleDateString()}`],
      [`Report Type: ${selectedReport === 'all' ? 'All Students' : 
        selectedReport === 'regular' ? 'Regular Students' :
        selectedReport === 'disabled' ? 'Disabled Students' :
        selectedReport === 'special' ? 'Special Students' :
        selectedReport === 'fresh' ? 'Fresh Students' :
        selectedReport === 'senior' ? 'Senior Students' :
        selectedReport === 'remedial' ? 'Remedial Students' : 'Unknown'
      }`],
      [''],
      ['Student Statistics'],
      ['Metric', 'Value'],
      ['Total Students', stats.total],
      ['Male Students', stats.male],
      ['Female Students', stats.female],
      ['Regular Students', stats.regular],
      ['Disabled Students', stats.disabled],
      ['Special Students', stats.special],
      ['']
    ];
    
    // Get student distribution by block
    const blockDistribution = {};
    filteredStudents.forEach(student => {
      const blockNum = student.blockNum || 'Unassigned';
      blockDistribution[blockNum] = (blockDistribution[blockNum] || 0) + 1;
    });
    
    statsData.push(['Student Distribution by Block']);
    statsData.push(['Block', 'Students', 'Percentage']);
    
    Object.keys(blockDistribution).forEach(blockNum => {
      statsData.push([
        blockNum === 'Unassigned' ? 'Unassigned' : `Block ${blockNum}`,
        blockDistribution[blockNum],
        ((blockDistribution[blockNum] / stats.total) * 100).toFixed(1) + '%'
      ]);
    });
    
    const wsStats = utils.aoa_to_sheet(statsData);
    utils.book_append_sheet(wb, wsStats, 'Student Statistics');
    
    // 2. Proctor Sheet
    const proctorData = [
      ['Proctor Statistics'], 
      ['Total Proctors', proctorSummary.total],
      [''],
      ['Name', 'Email', 'Phone', 'Block', 'Gender', 'Position'],
      ...proctorSummary.proctors.map(p => [
        p.name, p.email, p.phone, p.block, p.gender, p.position
      ])
    ];
    const wsProctor = utils.aoa_to_sheet(proctorData);
    utils.book_append_sheet(wb, wsProctor, 'Proctors');
    
    // 3. Block Statistics Sheet
    const blockData = [
      ['Block Statistics'],
      ['Block', 'Capacity', 'Occupied', 'Available', 'Occupancy Rate', 'Total Dorms', 'Available Rooms', 'Full Rooms', 'Under Maintenance'],
      ...blockSummary.map(b => [
        b.block, 
        b.capacity, 
        b.occupied, 
        b.available, 
        b.occupancyRate,
        b.dorms,
        b.availableRooms,
        b.fullRooms,
        b.underMaintenance
      ])
    ];
    const wsBlock = utils.aoa_to_sheet(blockData);
    utils.book_append_sheet(wb, wsBlock, 'Block Statistics');
    
    // 4. Dorm Statistics Sheet
    const dormData = [
      ['Dorm Statistics'],
      ['Metric', 'Value'],
      ['Total Dorms', dormSummary.total],
      ['Available', dormSummary.available],
      ['Full', dormSummary.full],
      ['Under Maintenance', dormSummary.maintenance],
      ['Unavailable', dormSummary.unavailable]
    ];
    const wsDorm = utils.aoa_to_sheet(dormData);
    utils.book_append_sheet(wb, wsDorm, 'Dorm Statistics');
    
    // 5. Maintenance Issues Sheet
    const maintenanceData = [
      ['Maintenance Issues'],
      ['Metric', 'Value'],
      ['Total Issues', maintenanceSummary.total],
      ['Pending', maintenanceSummary.pending],
      ['Resolved', maintenanceSummary.resolved],
      ['In Progress', maintenanceSummary.inProgress],
      ['Verified', maintenanceSummary.verified]
    ];
    const wsMaintenance = utils.aoa_to_sheet(maintenanceData);
    utils.book_append_sheet(wb, wsMaintenance, 'Maintenance Issues');
    
    // 6. Control Issues Sheet
    const controlData = [
      ['Control Issues'],
      ['Metric', 'Value'],
      ['Total Controls', controlsSummary.total],
      ['Open', controlsSummary.open],
      ['Closed', controlsSummary.closed],
      ['In Progress', controlsSummary.inProgress],
      ['Passed', controlsSummary.passed]
    ];
    const wsControl = utils.aoa_to_sheet(controlData);
    utils.book_append_sheet(wb, wsControl, 'Control Issues');

    // Generate Excel file
    writeFile(wb, `comprehensive_report_${new Date().toISOString().split('T')[0]}.xlsx`);
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
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Statistics Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Report Generation Skeleton */}
          <Card className="mb-8">
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-10 w-full mb-2" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts Skeleton */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const stats = calculateStatistics(getFilteredStudents());

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-blue-500"
          variants={itemVariants}
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Dormitory Management System</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium px-3 py-1">
              Generate Reports
            </Badge>
          <p className="text-gray-600">
              Comprehensive analytics and statistics dashboard
          </p>
        </div>
        </motion.div>

        {/* Tabs for different views */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="statistics">Detailed Statistics</TabsTrigger>
              <TabsTrigger value="reports">Generate Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              {/* Overview Dashboard */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={itemVariants}>
                  <Card className="overflow-hidden border-t-4 border-blue-500 transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-white pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-medium text-blue-700">
                          Student Statistics
                        </CardTitle>
                        <FaUsers className="h-5 w-5 text-blue-500" />
                      </div>
                      <CardDescription>Students currently in the system</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
                      <div className="flex justify-between mt-4">
                        <div>
                          <p className="text-sm text-gray-500">Male</p>
                          <p className="text-lg font-semibold">{stats.male}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Female</p>
                          <p className="text-lg font-semibold">{stats.female}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="overflow-hidden border-t-4 border-emerald-500 transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-emerald-50 to-white pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-medium text-emerald-700">
                          Staff Statistics
                        </CardTitle>
                        <FaBuilding className="h-5 w-5 text-emerald-500" />
                      </div>
                      <CardDescription>Proctors and facilities</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Proctors</p>
                          <p className="text-xl font-semibold">{proctorSummary.total}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Blocks</p>
                          <p className="text-xl font-semibold">{blockSummary.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Dorms</p>
                          <p className="text-xl font-semibold">{dormSummary.total}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="overflow-hidden border-t-4 border-amber-500 transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-amber-50 to-white pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-medium text-amber-700">
                          Issues Summary
                        </CardTitle>
                        <FaExclamationTriangle className="h-5 w-5 text-amber-500" />
                      </div>
                      <CardDescription>Maintenance and control issues</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Maintenance</p>
                          <p className="text-xl font-semibold">{maintenanceSummary.total}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Control Issues</p>
                          <p className="text-xl font-semibold">{controlsSummary.total}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">Dorms Under Maintenance</p>
                      <div className="mt-1 h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500" 
                          style={{ 
                            width: `${dormSummary.total > 0 ? (dormSummary.maintenance / dormSummary.total) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                      <p className="text-right text-xs text-gray-500 mt-1">
                        {dormSummary.maintenance} out of {dormSummary.total}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
          
              {/* Student Distribution Chart */}
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6 mb-8 transition-all duration-300 hover:shadow-lg"
                variants={itemVariants}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaChartBar className="mr-2 text-blue-500" />
                  Student Distribution
                </h2>
                <StudentInfoChart data={getFilteredStudents()} />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="statistics">
              {/* Student Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="overflow-hidden border-t-4 border-indigo-500 transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-white">
                    <CardTitle className="text-indigo-700">Student Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <p>Regular Students</p>
                          <p className="font-medium">{stats.regular}/{stats.total}</p>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500" 
                            style={{ width: `${(stats.regular / stats.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <p>Disabled Students</p>
                          <p className="font-medium">{stats.disabled}/{stats.total}</p>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500" 
                            style={{ width: `${(stats.disabled / stats.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <p>Special Students</p>
                          <p className="font-medium">{stats.special}/{stats.total}</p>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500" 
                            style={{ width: `${(stats.special / stats.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden border-t-4 border-purple-500 transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-white">
                    <CardTitle className="text-purple-700">Dorm Statistics</CardTitle>
            </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-gray-500">Total Dorms</p>
                        <p className="text-2xl font-bold text-purple-700">{dormSummary.total}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-500">Available</p>
                        <p className="text-2xl font-bold text-green-600">{dormSummary.available}</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-500">Full</p>
                        <p className="text-2xl font-bold text-blue-600">{dormSummary.full}</p>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <p className="text-sm text-gray-500">Under Maintenance</p>
                        <p className="text-2xl font-bold text-amber-600">{dormSummary.maintenance}</p>
                      </div>
                    </div>
            </CardContent>
          </Card>
              </div>
              
              {/* Block Statistics */}
              <Card className="mb-8 overflow-hidden border-t-4 border-teal-500 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-white">
                  <CardTitle className="text-teal-700">Block Statistics</CardTitle>
            </CardHeader>
                <CardContent className="pt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border px-4 py-2 text-left">Block</th>
                          <th className="border px-4 py-2 text-left">Capacity</th>
                          <th className="border px-4 py-2 text-left">Occupied</th>
                          <th className="border px-4 py-2 text-left">Available</th>
                          <th className="border px-4 py-2 text-left">Occupancy</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blockSummary.map((block, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="border px-4 py-2">{block.block}</td>
                            <td className="border px-4 py-2">{block.capacity}</td>
                            <td className="border px-4 py-2">{block.occupied}</td>
                            <td className="border px-4 py-2">{block.available}</td>
                            <td className="border px-4 py-2">{block.occupancyRate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
            </CardContent>
          </Card>
            </TabsContent>
            
            <TabsContent value="reports">
              {/* Report Generation */}
              <Card className="mb-8 overflow-hidden border-t-4 border-rose-500 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="bg-gradient-to-r from-rose-50 to-white">
                  <CardTitle className="text-rose-700">Generate Report</CardTitle>
                  <CardDescription>
                    Select options and download your report
                  </CardDescription>
            </CardHeader>
                <CardContent className="pt-4">
              <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Block</label>
                <Select value={selectedBlock} onValueChange={setSelectedBlock}>
                          <SelectTrigger className="w-full">
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
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Student Type</label>
                <Select value={selectedReport} onValueChange={setSelectedReport}>
                          <SelectTrigger className="w-full">
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
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <Button 
                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={generatePDF}
                  >
                    <FaFilePdf />
                        Download PDF
                  </Button>
                  <Button 
                        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={generateExcel}
                  >
                    <FaFileExcel />
                        Download Excel
                  </Button>
                  <Button 
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => window.print()}
                  >
                    <FaPrint />
                        Print Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
} 