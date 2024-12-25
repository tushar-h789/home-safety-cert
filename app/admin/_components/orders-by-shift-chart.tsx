"use client";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ShiftData = {
  day: string;
  Morning: number;
  Afternoon: number;
  Evening: number;
};

const dummyData: ShiftData[] = [
  { day: "Mon", Morning: 12, Afternoon: 19, Evening: 3 },
  { day: "Tue", Morning: 15, Afternoon: 21, Evening: 5 },
  { day: "Wed", Morning: 18, Afternoon: 25, Evening: 7 },
  { day: "Thu", Morning: 14, Afternoon: 22, Evening: 6 },
  { day: "Fri", Morning: 20, Afternoon: 28, Evening: 10 },
  { day: "Sat", Morning: 25, Afternoon: 30, Evening: 15 },
  { day: "Sun", Morning: 10, Afternoon: 15, Evening: 5 },
];

const COLORS = {
  Morning: "#8884d8",
  Afternoon: "#82ca9d",
  Evening: "#ffc658",
};

export function OrdersByShift() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders by Shift</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dummyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Morning" fill={COLORS.Morning} />
            <Bar dataKey="Afternoon" fill={COLORS.Afternoon} />
            <Bar dataKey="Evening" fill={COLORS.Evening} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
