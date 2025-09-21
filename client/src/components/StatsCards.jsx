import { TrendingUp, Users, Star } from 'lucide-react'

export default function StatsCards({ total=0, high=0, conversion=0 }) {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <Card title="Всего лидов" value={total} Icon={Users} />
      <Card title="Высокое качество" value={high} Icon={Star} />
      <Card title="Конверсия в высокие" value={`${conversion}%`} Icon={TrendingUp} />
    </div>
  )
}

function Card({ title, value, Icon }) {
  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-zinc-400 text-sm">{title}</div>
          <div className="text-3xl font-semibold mt-1">{value}</div>
        </div>
        <div className="p-3 bg-zinc-800 rounded-xl">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}
