import React from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import { Pie, Line } from 'react-chartjs-2'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatsCard = ({ stats }: { stats: { title: string; value: string; chart?: boolean; chartData?: any; chartType?: string; labels?: any }[] }) => {
  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <Card key={stat.title} className={`stats-card ${stat.chart ? 'learner-activity-card' : ''}`}>
          <CardHeader title={<span className="title">{stat.title}</span>} />
          <CardContent className="card-content">
            <div className="value">{stat.value}</div>
            {stat.chart && stat.chartData && (
              <div className="chart-container">
                {stat.chartType === 'line' ? (
                  <div className="chart" style={{ width: '100%', height: '400px' }}>
                    <Line 
                      data={stat.chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: 'rgba(0, 0, 0, 0.1)',
                            },
                            ticks: {
                              padding: 10
                            }
                          },
                          x: {
                            grid: {
                              color: 'rgba(0, 0, 0, 0.1)',
                            },
                            ticks: {
                              maxRotation: 45,
                              minRotation: 45,
                              autoSkip: true,
                              maxTicksLimit: 15
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            position: 'top',
                            align: 'start',
                            labels: {
                              boxWidth: 15,
                              usePointStyle: true,
                              pointStyle: 'rect'
                            }
                          }
                        },
                        elements: {
                          point: {
                            radius: 4,
                            hoverRadius: 6
                          },
                          line: {
                            tension: 0.4
                          }
                        },
                        layout: {
                          padding: {
                            left: 10,
                            right: 25,
                            top: 20,
                            bottom: 10
                          }
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="chart">
                    <Pie data={stat.chartData} />
                  </div>
                )}
                {stat.labels && stat.chartType !== 'line' && (
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