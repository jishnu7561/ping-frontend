import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import request from '../../../common/utils/APIs/UserApis';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';

Chart.register(...registerables);

const ChartComponent = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [chartData, setChartData] = useState({ labels: [], values: [] });
  const [filter, setFilter] = useState('year');

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

  useEffect(() => {
    submitHandler(filter);
  }, [filter]);

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

  const downloadPdf = () => {
    const canvas = chartRef.current;
    html2canvas(canvas).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg');
      const pdf = new jsPDF('p', 'mm', 'a4');
  
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
  
      // Add heading image in the center
      const headingImage = new Image();
      headingImage.src = '/images/ping2.jpeg';
      headingImage.onload = () => {
        const imgWidth = 60;
        const imgHeight = 30;
        const imgX = (pageWidth - imgWidth) / 2;
        const imgY = 10;
        pdf.addImage(headingImage, 'JPEG', imgX, imgY, imgWidth, imgHeight);
  
        // Add underline below the heading image
        pdf.setLineWidth(0.5);
        pdf.line(10, imgY + imgHeight + 10, pageWidth - 10, imgY + imgHeight + 10);
  
        // Add generated time below the underline on the left side
        pdf.setFontSize(12);
        pdf.text(`Generated on: ${new Date().toLocaleString()}`, 10, imgY + imgHeight + 20);
  
        // Add chart details text
        pdf.setFontSize(14);
        pdf.text('User Active Chart', (pageWidth - pdf.getTextWidth('User Active Chart')) / 2, imgY + imgHeight + 30);
        pdf.setLineWidth(0.5);
        pdf.line(10, imgY + imgHeight + 32, pageWidth - 10, imgY + imgHeight + 32);
  
        // Add chart image
        pdf.addImage(imgData, 'JPEG', 10, imgY + imgHeight + 40, pageWidth - 20, (pageWidth - 20) * 0.5625); // Maintaining aspect ratio
  
        // Add conclusion text
        pdf.setFontSize(14);
        pdf.text('Conclusion:', 10, pageHeight - 50);
        pdf.setFontSize(12);
        const conclusionText = `The active user trends show significant insights into user engagement over the selected period.`;
        pdf.text(conclusionText, 10, pageHeight - 40, { maxWidth: pageWidth - 20 });
  
        // Add signature
        pdf.setFontSize(12);
        pdf.text('Signature:', 10, pageHeight - 20);
        pdf.line(30, pageHeight - 20, 70, pageHeight - 20); // Signature line
  
        pdf.save('chart.pdf');
      };
    });
  };
  

  const downloadTableAsPdf = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
  
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    // Add heading image in the center
    const headingImage = new Image();
    headingImage.src = '/images/ping2.jpeg';
    headingImage.onload = () => {
      const imgWidth = 60;
      const imgHeight = 30;
      const imgX = (pageWidth - imgWidth) / 2;
      const imgY = 10;
      doc.addImage(headingImage, 'JPEG', imgX, imgY, imgWidth, imgHeight);
  
      // Add underline below the heading image
      doc.setLineWidth(0.5);
      doc.line(10, imgY + imgHeight + 10, pageWidth - 10, imgY + imgHeight + 10);
  
      // Add generated time below the underline on the left side
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, imgY + imgHeight + 20);
  
      // Add table title
      doc.setFontSize(14);
      doc.text('User Active Data Table', (pageWidth - doc.getTextWidth('User Active Data Table')) / 2, imgY + imgHeight + 30);
      doc.setLineWidth(0.5);
      doc.line(10, imgY + imgHeight + 32, pageWidth - 10, imgY + imgHeight + 32);
  
      // Add table with data
      doc.autoTable({
        startY: imgY + imgHeight + 40,
        head: [['Date', 'Value']],
        body: chartData.labels.map((label, index) => [label, chartData.values[index]]),
        margin: { top: 50, bottom: 50 },
        styles: { fontSize: 10 }
      });
  
      // Add conclusion text
      doc.setFontSize(14);
      doc.text('Conclusion:', 10, pageHeight - 50);
      doc.setFontSize(12);
      const conclusionText = `The active user trends show significant insights into user engagement over the selected period.`;
      doc.text(conclusionText, 10, pageHeight - 40, { maxWidth: pageWidth - 20 });
  
      // Add signature
      doc.setFontSize(12);
      doc.text('Signature:', 10, pageHeight - 20);
      doc.line(30, pageHeight - 20, 70, pageHeight - 20); // Signature line
  
      doc.save('table.pdf');
    };
  };
  

  return (
    <div style={{ height: '300px', width: '80%' }} className='flex flex-col gap-2'>
      <div className='flex gap-3 w-full justify-between'>
        <div className='flex gap-3'>
        <div 
          className='bg-black h-full rounded-xl flex items-center justify-center cursor-pointer '
          onClick={() => setFilter("day")}>
          <p className={`px-3 py-1 ${filter === 'day' ? 'text-green' : 'text-white'}`}>Day</p>
        </div>
        <div 
          className='bg-black h-full rounded-xl flex items-center justify-center cursor-pointer'
          onClick={() => setFilter("month")}>
          <p className={`px-3 py-1 ${filter === 'month' ? 'text-green' : 'text-white'}`}>Month</p>
        </div>
        <div 
          className='bg-black h-full rounded-xl flex items-center justify-center cursor-pointer'
          onClick={() => setFilter("year")}>
          <p className={`px-3 py-1 ${filter === 'year' ? 'text-green' : 'text-white'}`}>Year</p>
        </div>
        </div>
        <div className='flex gap-3'>
        <div 
          className='bg-black h-full px-3 py-1 gap-2 rounded-xl flex items-center justify-center cursor-pointer '
          onClick={downloadPdf}>
          <i class="fa-light fa-download text-green"></i>
          <p className="text-green">Chart</p>
        </div>
        <div 
          className='bg-black px-3 py-1 h-full rounded-xl flex items-center justify-center cursor-pointer gap-2'
          onClick={downloadTableAsPdf}>
          <i class="fa-light fa-download text-green"></i>
          <p className=" text-green">Table</p>
        </div>
        </div>
      </div>
      {/* <button onClick={downloadPdf}>Download Chart as PDF</button>
      <button onClick={downloadTableAsPdf}>Download Table as PDF</button> */}
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ChartComponent;
