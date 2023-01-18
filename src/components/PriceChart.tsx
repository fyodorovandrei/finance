import React, { useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Price } from "../store/slices/prices";
import { Stock } from "../store/slices/stocks";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Props = {
    stock: Stock;
    data: Price[];
};

const PriceChart: React.FC<Props> = ({ stock, data }) => {
    const options = {
        responsive: true,
        interaction: {
            mode: "index" as const,
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
                text: `${stock.name} (${stock.symbol})`,
            },
        },
        scales: {
            y: {
                type: "linear" as const,
                display: true,
                position: "left" as const,
            },
            y1: {
                type: "linear" as const,
                display: true,
                position: "right" as const,
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    const [datasetData, labels] = useMemo(() => {
        const labels: string[] = [];
        const datasetData: string[] = [];
        data.forEach((row) => {
            labels.push(row.date);
            datasetData.push(row.value);
        });

        return [datasetData, labels] as const;
    }, [data]);

    const chartData = {
        labels,
        datasets: [
            {
                label: stock.symbol,
                data: datasetData,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                yAxisID: "y",
            },
        ],
    };

    return <Line options={options} data={chartData} />;
};

export default PriceChart;
