"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardContent } from "@/components/ui/card";


type IncomeData = {
  date: string;
  income: number;
};

type Period = "weekly" | "monthly" | "yearly";

const dummyData: Record<string, IncomeData[]> = {
  weekly: [
    { date: "Mon", income: 900 },
    { date: "Tue", income: 1200 },
    { date: "Wed", income: 900 },
    { date: "Thu", income: 1500 },
    { date: "Fri", income: 2000 },
    { date: "Sat", income: 1800 },
    { date: "Sun", income: 1100 },
  ],
  monthly: [
    { date: "Week 1", income: 5000 },
    { date: "Week 2", income: 6200 },
    { date: "Week 3", income: 7100 },
    { date: "Week 4", income: 6800 },
  ],
  yearly: [
    { date: "Jan", income: 20000 },
    { date: "Feb", income: 22000 },
    { date: "Mar", income: 25000 },
    { date: "Apr", income: 23000 },
    { date: "May", income: 28000 },
    { date: "Jun", income: 30000 },
    { date: "Jul", income: 32000 },
    { date: "Aug", income: 35000 },
    { date: "Sep", income: 33000 },
    { date: "Oct", income: 35000 },
    { date: "Nov", income: 38000 },
    { date: "Dec", income: 40000 },
  ],
};

export function IncomeChart() {
  const [period, setPeriod] = useState<Period>("weekly");

  const [data, setData] = useState<IncomeData[]>([]);

  return (
    <Card className="col-span-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Income by Period</CardTitle>
        <Select
          value={period}
          onValueChange={(value) => setPeriod(value as Period)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dummyData[period]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
