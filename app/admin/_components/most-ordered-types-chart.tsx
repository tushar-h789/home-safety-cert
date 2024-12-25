import {
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
  } from "recharts";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  
  type ServiceTypeData = {
    name: string;
    value: number;
  };
  
  const dummyData: ServiceTypeData[] = [
    { name: "Certificate", value: 400 },
    { name: "Repair", value: 300 },
    { name: "Installation", value: 200 },
    { name: "Inspection", value: 150 },
    { name: "Others", value: 50 },
  ];
  
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
  
  export function MostOrderedServiceTypes() {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Most Ordered Service Types</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dummyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {dummyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }
  