import React from 'react';
import { Card, CardContent, CardHeader, Button } from '@mui/material';
import { Pie, Line } from 'react-chartjs-2'

// Define time period type
type TimePeriod = 'daily' | 'monthly' | 'yearly';

// Define interfaces for chart data
interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string | string[];
  borderWidth?: number;
  tension?: number;
  fill?: boolean;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

interface StatLabels {
  enrolled?: number;
  notyetenrolled?: number;
}

interface StatItem {
  title: string;
  value: string;
}

interface Stat {
  title: string;
  value: string;
  chart?: boolean;
  chartData?: ChartData;
  chartType?: string;
  labels?: StatLabels;
  combined?: boolean;
  items?: StatItem[];
}

const StatsCard = ({ 
  stats, 
  timePeriod, 
  onTimePeriodChange 
}: { 
  stats: Stat[];
  timePeriod?: TimePeriod;
  onTimePeriodChange?: (period: TimePeriod) => void;
}) => {
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
                  {/* Time period filters for line charts */}
                  {stat.chartType === 'line' && onTimePeriodChange && (
                    <div className="time-period-filters">
                      <Button 
                        variant={timePeriod === 'daily' ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => onTimePeriodChange('daily')}
                        sx={{ mr: 1 }}
                      >
                        Daily
                      </Button>
                      <Button 
                        variant={timePeriod === 'monthly' ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => onTimePeriodChange('monthly')}
                        sx={{ mr: 1 }}
                      >
                        Monthly
                      </Button>
                      <Button 
                        variant={timePeriod === 'yearly' ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => onTimePeriodChange('yearly')}
                      >
                        Yearly
                      </Button>
                    </div>
                  )}
                  
                  {/* Line Chart */}
                  {stat.chartType === 'line' ? (
                    <div className="chart">
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
                                stepSize: 1,
                                precision: 0,
                                padding: 15,
                                color: 'rgba(255, 255, 255, 0.7)',
                                font: {
                                  size: 14
                                }
                              },
                              border: {
                                display: false
                              }
                            },
                            x: {
                              grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                              },
                              ticks: {
                                maxRotation: 45,
                                minRotation: 45,
                                autoSkip: true,
                                maxTicksLimit: 15,
                                color: 'rgba(255, 255, 255, 0.7)',
                                font: {
                                  size: 14
                                }
                              }
                            }
                          },
                          plugins: {
                            legend: {
                              display: false,
                            },
                            tooltip: {
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              titleColor: 'rgba(255, 255, 255, 0.9)',
                              bodyColor: 'rgba(255, 255, 255, 0.9)',
                              padding: 15,
                              cornerRadius: 5,
                              boxPadding: 5,
                              titleFont: {
                                size: 16
                              },
                              bodyFont: {
                                size: 14
                              }
                            }
                          },
                          elements: {
                            point: {
                              radius: 4,
                              hoverRadius: 8,
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
                              left: 30,
                              right: 25,
                              top: 20,
                              bottom: 10
                            }
                          }
                        }}
                      />
                    </div>
                  ) : (
                    /* Pie Chart */
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
                  
                  {/* Labels for pie charts */}
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