import { Card, CardContent } from "@/components/ui/Card"

interface StatsCardProps {
    title: string
    value: string | number
    change?: string
    changeType?: "positive" | "negative" | "neutral"
    subtext?: string
}

export function StatsCard({ title, value, change, changeType = "positive", subtext }: StatsCardProps) {
    return (
        <Card className="border-none shadow-sm">
            <CardContent className="p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
                <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
                {(change || subtext) && (
                    <div className="flex items-center text-sm">
                        {change && (
                            <span
                                className={`font-medium ${changeType === "positive"
                                        ? "text-green-600"
                                        : changeType === "negative"
                                            ? "text-red-600"
                                            : "text-gray-600"
                                    }`}
                            >
                                {change}
                            </span>
                        )}
                        {subtext && <span className="text-gray-400 ml-1">{subtext}</span>}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
