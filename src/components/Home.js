import React from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Category 1', value: 100 },
  { name: 'Category 2', value: 100 },
  { name: 'Category 3', value: 100 },
  { name: 'Category 4', value: 100 },
  { name: 'Category 5', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Home() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="30%" // Adjust this to align the Pie component
            cy="50%"
            labelLine={false}
            label={({ name, percent, value }) => `${name}: ${(percent * 100).toFixed(0)}% (${value})`} // Include the value in the label
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {
              data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
            }
          </Pie>
          {/* <Tooltip /> */}
          <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ lineHeight: '40px', marginRight: '20%' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
