"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

const data = [
    { day: "Mon", hours: 4 },
    { day: "Tue", hours: 7 },
    { day: "Wed", hours: 5 },
    { day: "Thu", hours: 8 },
    { day: "Fri", hours: 3 },
    { day: "Sat", hours: 12 },
    { day: "Sun", hours: 6 },
]

export function StudyActivityChart() {
    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-gray-500">Study Activity (Last 7 Days)</CardTitle>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">15 Hours</span>
                    <span className="text-sm font-medium text-green-600">+15%</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis
                                dataKey="day"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{ background: "#fff", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                cursor={{ stroke: "#e5e7eb" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="hours"
                                stroke="#2DD4BF"
                                strokeWidth={3}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
