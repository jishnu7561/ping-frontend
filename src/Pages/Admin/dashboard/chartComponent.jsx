import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import DateRangePicker from './dateRangePicker';
import request from '../../../common/utils/APIs/UserApis';

// Register the necessary components with Chart.js
Chart.register(...registerables);

const ChartComponent = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [chartData, setChartData] = useState({ labels: [], values: [] });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filter,setFilter] = useState('year')

  const submitHandler = async (selectedFilter) => {
    
    try {
      const response = await request("GET", `/user/api/admin/chartDetails/${selectedFilter}`, {});
      const res = response.data;
      console.log("Response of chart:", response);

      const labels = [];
      const values = [];

      for (let key in res) {
        if (key.startsWith('data') && !key.startsWith('dataValue')) {
          labels.push(res[key]);
        } else if (key.startsWith('dataValue')) {
          values.push(res[key]);
        }
      }
      
      console.log("Labels:", labels);
      console.log("Values:", values);

      setChartData({ labels, values });
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(()=>{
    submitHandler(filter);
  },[filter])

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const chartConfig = {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Daily Users',
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointRadius: 1,
            pointHitRadius: 10,
            data: chartData.values,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    };

    chartInstanceRef.current = new Chart(ctx, chartConfig);

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div style={{ height: '300px', width: '80%' }} className='flex flex-col gap-2'>
      <div className='flex gap-3'>
        <div 
          className='bg-black h-full rounded-xl flex items-center justify-center cursor-pointer '
          onClick={()=>setFilter("day")}>
          <p className={`px-3 py-1 ${filter === 'day' ? 'text-green' : 'text-white'}`}>Day</p>
        </div>
        <div 
          className='bg-black h-full rounded-xl flex items-center justify-center cursor-pointer'
          onClick={()=>setFilter("month")}>
          <p className={`px-3 py-1 ${filter === 'month' ? 'text-green' : 'text-white'}`}>Month</p>
        </div>
        <div 
          className='bg-black h-full rounded-xl flex items-center justify-center cursor-pointer'
          onClick={()=>setFilter("year")}>
          <p className={`px-3 py-1 ${filter === 'year' ? 'text-green' : 'text-white'}`}>Year</p>
        </div>
      </div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ChartComponent;
