import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const LineChart = ({ data, options }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');
        // destroy the previous chart
        if (window.myLineChart) {
            window.myLineChart.destroy();
        }
        // new Chart(ctx, {
        //     type: 'line',
        //     data,
        //     options
        // });
        window.myLineChart = new Chart(ctx, {
            type: 'line',
            data,
            options
        });
    }, [data, options]);

    return <canvas ref={chartRef} />;
};

export default LineChart;
