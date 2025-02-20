import React from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import { Pie } from 'react-chartjs-2'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatsCard = ({ stats }: { stats: { title: string; value: string; chart?: boolean; chartData?: any; labels?: { enrolled: string; notyetenrolled: string } }[] }) => {
  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <Card key={stat.title} className="stats-card">
          <CardHeader title={<span className="title">{stat.title}</span>} />
          <CardContent className="card-content">
            <div className="value">{stat.value}</div>
            {stat.chart && stat.chartData && (
              <div className="chart-container">
                <div className="chart">
                  <Pie data={stat.chartData} />
                </div>
                {stat.labels && (
                  <div className="labels">
                    <div className="label">
                      <span className="color-indicator" style={{ backgroundColor: stat.chartData.datasets[0].backgroundColor[0] }}></span>
                      Enrolled: {stat.labels.enrolled}
                    </div>
                    <div className="label">
                      <span className="color-indicator" style={{ backgroundColor: stat.chartData.datasets[0].backgroundColor[1] }}></span>
                      Not yet Enrolled: {stat.labels.notyetenrolled}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCard;