"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

const data = [
    { subject: "Physics", chapters: 12, fill: "#D1FAE5" }, // Light Green
    { subject: "Math", chapters: 8, fill: "#D1FAE5" },
    { subject: "History", chapters: 24, fill: "#D1FAE5" },
    { subject: "Civics", chapters: 8, fill: "#D1FAE5" },
]

export function SubjectProgressChart() {
    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-gray-500">Chapters by Subject</CardTitle>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">42 Chapters</span>
                    <span className="text-sm font-medium text-green-600">+5%</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis
                                dataKey="subject"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Bar
                                dataKey="chapters"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
