import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/app/components/ui/card';
import { Button } from '@/src/app/components/ui/button';
import { Users, Ticket, DollarSign, BarChart2 } from 'lucide-react';

const stats = [
  { title: 'Total Users', value: '5,234', icon: Users, color: 'text-blue-500' },
  {
    title: 'Total Tickets',
    value: '12,543',
    icon: Ticket,
    color: 'text-green-500',
  },
  {
    title: 'Revenue',
    value: '$103,430',
    icon: DollarSign,
    color: 'text-yellow-500',
  },
  {
    title: 'Conversion Rate',
    value: '3.2%',
    icon: BarChart2,
    color: 'text-purple-500',
  },
];

const quickLinks = [
  { title: 'Manage Catalogs', href: '/admin/catalogs' },
  { title: 'User Management', href: '/admin/users' },
  { title: 'Sales Reports', href: '/admin/reports' },
  { title: 'Settings', href: '/admin/settings' },
];

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link, index) => (
          <Button
            key={index}
            asChild
            variant="outline"
            className="w-full justify-start"
          >
            <Link href={link.href}>{link.title}</Link>
          </Button>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Action</th>
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">New user registration</td>
                  <td className="p-4">john@example.com</td>
                  <td className="p-4">2023-06-15</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Ticket purchase</td>
                  <td className="p-4">sarah@example.com</td>
                  <td className="p-4">2023-06-14</td>
                </tr>
                <tr>
                  <td className="p-4">Catalog updated</td>
                  <td className="p-4">admin@example.com</td>
                  <td className="p-4">2023-06-13</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
