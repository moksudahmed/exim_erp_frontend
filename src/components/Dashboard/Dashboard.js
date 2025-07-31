import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './styles/Dashboard.css';

const Dashboard = () => {
  const data = [
    { name: '9:00AM', Open: 400, Click: 240, ClickSecondTime: 240 },
    { name: '12:00PM', Open: 300, Click: 139, ClickSecondTime: 221 },
    { name: '3:00PM', Open: 200, Click: 980, ClickSecondTime: 229 },
    { name: '6:00PM', Open: 278, Click: 390, ClickSecondTime: 200 },
    { name: '9:00PM', Open: 189, Click: 480, ClickSecondTime: 218 },
    { name: '12:00AM', Open: 239, Click: 380, ClickSecondTime: 250 },
    { name: '3:00AM', Open: 349, Click: 430, ClickSecondTime: 210 },
  ];

  const pieData = [
    { name: 'Open', value: 40 },
    { name: 'Bounce', value: 20 },
    { name: 'Unsubscribe', value: 20 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="dashboard-content">
      <div className="stats-cards">
        <div className="stat-card">
          <h4>Number</h4>
          <p>150GB</p>
        </div>
        <div className="stat-card">
          <h4>Revenue</h4>
          <p>$1,345</p>
        </div>
        <div className="stat-card">
          <h4>Errors</h4>
          <p>23</p>
        </div>
        <div className="stat-card">
          <h4>Followers</h4>
          <p>+45K</p>
        </div>
      </div>

      <div className="charts">
        <div className="line-chart">
          <h4>Users Behavior</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Open" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Click" stroke="#82ca9d" />
              <Line type="monotone" dataKey="ClickSecondTime" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="pie-chart">
          <h4>Email Statistics</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
