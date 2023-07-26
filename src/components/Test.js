import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';

const data = [
  { name: 'Category1', value: 10,},
  { name: 'Category2', value: 5,},
  { name: 'Category3', value: 7,},
  { name: 'Category4', value: 4,},
  { name: 'Category5', value: 6,},
  { name: 'Category6', value: 2,},
  { name: 'Category7', value: 1,},
  { name: 'Category8', value: 8,}, 
];

const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#8dd1e1'];

const Test = () => (
  <div style={{ width: '100%', height:  700 }}>
    <ResponsiveContainer>
      <BarChart
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        {/* <Tooltip /> */}
        <Legend />
        <Bar dataKey="value">
          {
            data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))
          }
          <LabelList dataKey="value" position="top" fill="#000" fontWeight="600"  />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
  
);

export default Test;
