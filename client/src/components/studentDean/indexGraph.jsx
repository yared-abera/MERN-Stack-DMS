import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StudentInfoChart = () => {
  const { AllocatedStudent } = useSelector(state => state.student);
  const [chartData, setChartData] = useState([]);

  // Normalizer with null/undefined checks
  const normalize = (value) => {
    if (value === null || value === undefined) return '';
    try {
      return value.toString().trim().toLowerCase();
    } catch {
      return '';
    }
  };

  console.log("AllocatedStudent in indexGraph", AllocatedStudent)

  // Debug logging function
  // const logDataIssue = (message, data) => {
  //   console.group('Chart Data Issue');
  //   console.log(message);
  //   console.log('Raw AllocatedStudent:', AllocatedStudent);
  //   console.log('Data at issue:', data);
  //   console.groupEnd();
  // };

  useEffect(() => {
    // Helper: determine the data array
    const getDataArray = () => {
      if (AllocatedStudent) {
        if (Array.isArray(AllocatedStudent)) {
          return AllocatedStudent;
        } else if (Array.isArray(AllocatedStudent.data)) {
          return AllocatedStudent.data;
        }
      }
      return [];
    };

    const processData = () => {
      const rawData = getDataArray();

      if (!rawData.length) {
        console.log('No valid student array found', AllocatedStudent);
        return [];
      }

      // Check that at least one item contains the required fields
      const sampleItem = rawData[0];
      if (!sampleItem?.studCategory || !sampleItem?.sex) {
         console.log('Missing required fields (studCategory or sex) in data items', rawData);
        return [];
      }

      // Define categories we want to include
      const categories = ['fresh', 'remedial', 'senior'];
      // Initialize our category map with counts for each category
      const categoryMap = categories.reduce((acc, cat) => {
        acc[cat] = {
          category: cat.charAt(0).toUpperCase() + cat.slice(1),
          regularMale: 0,
          regularFemale: 0,
          physicalImpairedMale: 0,
          physicalImpairedFemale: 0,
          scholarMale: 0,
          scholarFemale: 0
        };
        return acc;
      }, {});

      // Process each student entry
      rawData.forEach(stud => {
        const category = normalize(stud.studCategory);
        const sex = normalize(stud.sex);
        // Use provided keys or default to an empty string if not present
        const disabled = normalize(stud.disabilityStatus) === 'yes';
        const scholar = normalize(stud.isSpecial) === 'yes';

        // Skip any student whose category is not in our list
        if (!categories.includes(category)) return;

        const target = categoryMap[category];

        if (!disabled && !scholar) {
          sex === 'male' ? target.regularMale++ : target.regularFemale++;
        }
        if (disabled) {
          sex === 'male' ? target.physicalImpairedMale++ : target.physicalImpairedFemale++;
        }
        if (scholar) {
          sex === 'male' ? target.scholarMale++ : target.scholarFemale++;
        }
      });

      return Object.values(categoryMap);
    };

    // Process the data and update chartData
    const processedData = processData();
    
    if (processedData.length > 0) {
      setChartData(processedData);
    } else {
      console.log('Processed data is empty', processedData);
      setChartData([]);
    }
  }, [AllocatedStudent]);

  if (!chartData.length) {
    return (
      <div className="data-warning">
        <p>No data to display. This could be because:</p>
        <ul>
          <li>No students have been allocated yet</li>
          <li>Data format doesn't match expectations</li>
          <li>Connection issues with the data source</li>
        </ul>
        <p>Check browser console for detailed error information.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#f0f8ff', 
            border: '1px solid #ccc', 
            borderRadius: '5px' 
          }}
        />
        <Legend />
        
        {/* Male Bars */}
        <Bar 
          dataKey="regularMale" 
          stackId="male" 
          fill="#8884d8" 
          name="Male Regular" 
        />
        <Bar 
          dataKey="physicalImpairedMale" 
          stackId="male" 
          fill="#83a6ed" 
          name="Male Physical Impaired" 
        />
        <Bar 
          dataKey="scholarMale" 
          stackId="male" 
          fill="#8dd1e1" 
          name="Male Scholar" 
        />

        {/* Female Bars */}
        <Bar 
          dataKey="regularFemale" 
          stackId="female" 
          fill="#82ca9d" 
          name="Female Regular" 
        />
        <Bar 
          dataKey="physicalImpairedFemale" 
          stackId="female" 
          fill="#a4de6c" 
          name="Female Physical Impaired" 
        />
        <Bar 
          dataKey="scholarFemale" 
          stackId="female" 
          fill="#d0ed57" 
          name="Female Scholar" 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StudentInfoChart;
