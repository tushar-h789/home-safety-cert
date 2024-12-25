import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CheckCircle, ShoppingBag, LucideIcon } from "lucide-react";
import { getTodayStats, getTodayOrders } from "./orders/actions";
import { ContentLayout } from "../_components/admin-panel/content-layout";
import TodaysOrders from "../_components/dashboard/todays-orders";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          {trend && trend.value !== 0 && (
            <div
              className={`flex items-center ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              <span className="text-xs sm:text-sm font-medium">
                {trend.isPositive ? "↑" : "↓"}{" "}
                {Math.abs(trend.value).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg sm:text-2xl font-bold">{value}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function calculateTrend(
  currentValue: number,
  previousValue: number
): { value: number; isPositive: boolean } {
  if (previousValue === 0) return { value: 0, isPositive: true };
  const trendValue = ((currentValue - previousValue) / previousValue) * 100;
  return { value: trendValue, isPositive: trendValue >= 0 };
}

export default async function AdminDashboardPage() {
  const [todayStats, todayOrders] = await Promise.all([
    getTodayStats(),
    getTodayOrders(),
  ]);

  const {
    todayTotalOrders,
    yesterdayTotalOrders,
    todayCompletedOrders,
    yesterdayCompletedOrders,
    todayEarnings,
    yesterdayEarnings,
  } = todayStats;

  const totalOrdersTrend = calculateTrend(
    todayTotalOrders,
    yesterdayTotalOrders
  );
  const completedOrdersTrend = calculateTrend(
    todayCompletedOrders,
    yesterdayCompletedOrders
  );
  const earningsTrend = calculateTrend(todayEarnings, yesterdayEarnings);

  return (
    <ContentLayout title="Dashboard">
      <div className="mb-6 sm:mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">
              Today&apos;s Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TodaysOrders orders={todayOrders} />
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          Today&apos;s Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <StatCard
            title="Total Earnings"
            value={`£${todayEarnings.toFixed(2)}`}
            icon={DollarSign}
            trend={earningsTrend}
          />
          <StatCard
            title="Total Orders"
            value={todayTotalOrders}
            icon={ShoppingBag}
            trend={totalOrdersTrend}
          />
          <StatCard
            title="Completed Orders"
            value={todayCompletedOrders}
            icon={CheckCircle}
            trend={completedOrdersTrend}
          />
        </div>
      </div>
    </ContentLayout>
  );
}
