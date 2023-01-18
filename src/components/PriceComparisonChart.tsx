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
    ChartTypeRegistry,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Price } from "../store/slices/prices";
import { Stock } from "../store/slices/stocks";
import { TooltipItem } from "chart.js/dist/types";
import { styled } from "@mui/material/styles";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const FixedHeight = styled("div")`
    height: 450px;
`;

type Props = {
    stocks: Stock[];
    between: Price[][];
};

const calculatePerformance = (data: Price[]) => {
    const labels: string[] = [];
    const datasetData: string[] = [];
    data.forEach((row, i) => {
        labels.push(row.date);

        if (i === 0) {
            datasetData.push("0");
        } else {
            datasetData.push(100 - Math.round((+data[i - 1].value / +row.value) * 100) + "");
        }
    });

    return [datasetData, labels] as const;
};

const PriceComparisonChart: React.FC<Props> = ({ stocks, between }) => {
    const [firstStock, secondStock] = stocks;
    const [firstData, secondData] = between;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index" as const,
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
                text: "Day by Day performance",
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: TooltipItem<keyof ChartTypeRegistry>) =>
                        `${tooltipItem.formattedValue}%`,
                },
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

    const [firstDatasetData, labels] = useMemo(() => calculatePerformance(firstData), [firstData]);
    const [secondDatasetData] = useMemo(() => calculatePerformance(secondData), [secondData]);

    const chartData = {
        labels,
        datasets: [
            {
                label: firstStock.symbol,
                data: firstDatasetData,
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                yAxisID: "y",
            },
            {
                label: secondStock.symbol,
                data: secondDatasetData,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                yAxisID: "y",
            },
        ],
    };

    return (
        <FixedHeight>
            <Line options={options} data={chartData} />
        </FixedHeight>
    );
};

export default PriceComparisonChart;
