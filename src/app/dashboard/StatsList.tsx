import React from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import { Pie, Line } from 'react-chartjs-2'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatsCard = ({ stats }: { stats: { title: string; value: string; chart?: boolean; chartData?: any; chartType?: string; labels?: any; combined?: boolean; items?: any[] }[] }) => {
  return (
    <div className="stats-grid">
      {stats.map((stat) => {
        if (stat.combined && stat.items) {
          return (
            <Card key={stat.title} className="stats-card combined-stats-card">
              <CardHeader title={<span className="title">{stat.title}</span>} />
              <CardContent className="card-content combined-stats-content">
                <div className="combined-stats-grid">
                  {stat.items.map((item, index) => (
                    <div key={index} className="combined-stat-item">
                      <div className="combined-stat-title">{item.title}</div>
                      <div className="value">{item.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        }
        
        return (
          <Card key={stat.title} className={`stats-card ${stat.chart ? 'learner-activity-card' : ''}`}>
            <CardHeader title={<span className="title">{stat.title}</span>} />
            <CardContent className="card-content">
              {stat.value && <div className="value">{stat.value}</div>}
              {stat.chart && stat.chartData && (
                <div className="chart-container">
                  {stat.chartType === 'line' ? (
                    <div className="chart" style={{ width: '100%', height: '420px' }}>
                      <Line 
                        data={stat.chartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                              },
                              ticks: {
                                padding: 10,
                                color: 'rgba(255, 255, 255, 0.7)',
                                font: {
                                  size: 11
                                }
                              }
                            },
                            x: {
                              grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                                tickLength: 8
                              },
                              ticks: {
                                maxRotation: 45,
                                minRotation: 45,
                                autoSkip: true,
                                maxTicksLimit: 15,
                                color: 'rgba(255, 255, 255, 0.7)',
                                font: {
                                  size: 11
                                }
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
                                pointStyle: 'rect',
                                color: 'rgba(255, 255, 255, 0.9)',
                                padding: 15,
                                font: {
                                  size: 12
                                }
                              }
                            },
                            tooltip: {
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              titleColor: 'rgba(255, 255, 255, 0.9)',
                              bodyColor: 'rgba(255, 255, 255, 0.9)',
                              padding: 10,
                              cornerRadius: 5,
                              boxPadding: 5
                            }
                          },
                          elements: {
                            point: {
                              radius: 3,
                              hoverRadius: 6,
                              backgroundColor: '#00a1ff',
                              borderColor: '#ffffff'
                            },
                            line: {
                              tension: 0.4,
                              borderWidth: 3,
                            }
                          },
                          layout: {
                            padding: {
                              left: 10,
                              right: 25,
                              top: 30,
                              bottom: 10
                            }
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="chart">
                      <Pie 
                        data={stat.chartData}
                        options={{
                          plugins: {
                            legend: {
                              position: 'right',
                              labels: {
                                color: 'rgba(255, 255, 255, 0.9)',
                                padding: 15,
                                font: {
                                  size: 12
                                }
                              }
                            },
                            tooltip: {
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              titleColor: 'rgba(255, 255, 255, 0.9)',
                              bodyColor: 'rgba(255, 255, 255, 0.9)',
                              padding: 10,
                              cornerRadius: 5
                            }
                          }
                        }}
                      />
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
        );
      })}
    </div>
  );
};

export default StatsCard;