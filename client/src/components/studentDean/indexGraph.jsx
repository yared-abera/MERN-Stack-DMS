import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StudentInfoChart = () => {
  const { AllocatedStudent } = useSelector(state => state.student);
  const [chartData, setChartData] = useState([]);

  // Helper function to normalize strings (lowercase and trim)
  const normalize = (str) => (str ? str.toString().trim().toLowerCase() : '');

  useEffect(() => {
    if (AllocatedStudent.success && Array.isArray(AllocatedStudent.data)) {
      // Normalize and filter data by student category
      const freshData = AllocatedStudent.data.filter(stud => normalize(stud.studCategory) === 'fresh');
      const remedialData = AllocatedStudent.data.filter(stud => normalize(stud.studCategory) === 'remedial');
      const seniorData = AllocatedStudent.data.filter(stud => normalize(stud.studCategory) === 'senior');

      // Helper function to count the number of students for each subgroup
      const getCounts = (data) => ({
         regularMale: data.filter(stud => normalize(stud.sex) === 'male' && normalize(stud.disabilityStatus) === 'no' && normalize(stud.isSpecial) === 'no').length,
         regularFemale: data.filter(stud => normalize(stud.sex) === 'female' && normalize(stud.disabilityStatus) === 'no' && normalize(stud.isSpecial) === 'no').length,
         physicalImpairedMale: data.filter(stud => normalize(stud.sex) === 'male' && normalize(stud.disabilityStatus) === 'yes').length,
         physicalImpairedFemale: data.filter(stud => normalize(stud.sex) === 'female' && normalize(stud.disabilityStatus) === 'yes').length,
         scholarMale: data.filter(stud => normalize(stud.sex) === 'male' && normalize(stud.isSpecial) === 'yes').length,
         scholarFemale: data.filter(stud => normalize(stud.sex) === 'female' && normalize(stud.isSpecial) === 'yes').length,
      });

      const freshCounts = getCounts(freshData);
      const remedialCounts = getCounts(remedialData);
      const seniorCounts = getCounts(seniorData);

      // Prepare data for the chart
      const dataForChart = [
        {
          category: 'Fresh',
          ...freshCounts
        },
        {
          category: 'Remedial',
          ...remedialCounts
        },
        {
          category: 'Senior',
          ...seniorCounts
        }
      ];
      
      setChartData(dataForChart);
    }
  }, [AllocatedStudent]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip contentStyle={{ backgroundColor: '#f0f8ff', border: '1px solid #ccc', borderRadius: '5px' }} />
        <Legend />
        {/* Male Bars */}
        <Bar dataKey="regularMale" stackId="male" fill="#8884d8" name="Male Regular" />
        <Bar dataKey="physicalImpairedMale" stackId="male" fill="#83a6ed" name="Male Physical Impaired" />
        <Bar dataKey="scholarMale" stackId="male" fill="#8dd1e1" name="Male Scholar" />
        {/* Female Bars */}
        <Bar dataKey="regularFemale" stackId="female" fill="#82ca9d" name="Female Regular" />
        <Bar dataKey="physicalImpairedFemale" stackId="female" fill="#a4de6c" name="Female Physical Impaired" />
        <Bar dataKey="scholarFemale" stackId="female" fill="#d0ed57" name="Female Scholar" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StudentInfoChart;
