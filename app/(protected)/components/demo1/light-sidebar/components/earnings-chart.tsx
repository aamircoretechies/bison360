"use client";

import { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic"; // 👈 import dynamic
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 👇 dynamically import ApexChart so it never runs on server
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Hardcoded dummy data for the earnings chart
const dummyChartData: number[] = [
  58, 64, 52, 45, 42, 38, 45, 53, 56, 65, 75, 85,
];

const EarningsChart = () => {
  const [chartData, setChartData] = useState<number[]>(dummyChartData);
  const categories: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    setChartData(dummyChartData);
  }, []);

  const options: ApexOptions = {
    series: [
      {
        name: "Earnings",
        data: chartData ?? [],
      },
    ],
    chart: {
      height: 250,
      type: "area",
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: ["var(--color-primary)"],
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "var(--color-secondary-foreground)",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "var(--color-secondary-foreground)",
          fontSize: "12px",
        },
        formatter: (val) => `$${val}K`,
      },
    },
    tooltip: { enabled: true },
    markers: {
      size: 0,
      colors: "var(--color-white)",
      strokeColors: "var(--color-primary)",
      strokeWidth: 4,
      hover: { size: 8 },
    },
    fill: {
      gradient: { opacityFrom: 0.25, opacityTo: 0 },
    },
    grid: {
      borderColor: "var(--color-border)",
      strokeDashArray: 5,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
  };

  return (
    <Card className="h-full border-0">
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <div className="flex gap-5">
          <Select defaultValue="1">
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="w-28">
              <SelectItem value="1">1 month</SelectItem>
              <SelectItem value="3">3 months</SelectItem>
              <SelectItem value="6">6 months</SelectItem>
              <SelectItem value="12">12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-end items-stretch grow px-3 py-1">
        <ApexChart
          id="earnings_chart"
          options={options}
          series={options.series as any} // 👈 type fix
          type="area"
          height={250}
        />
      </CardContent>
    </Card>
  );
};

export { EarningsChart };
