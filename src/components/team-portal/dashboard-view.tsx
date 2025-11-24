'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, Package, DollarSign } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SalesStats {
  today: number;
  week: number;
  month: number;
  total: number;
  totalOrders: number;
}

interface OrderCounts {
  pending: number;
  preparing: number;
  completed: number;
  cancelled: number;
  total: number;
}

interface TopProduct {
  productId: number;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}

interface RecentOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface SalesTrendData {
  date: string;
  sales: number;
  orderCount: number;
}

export const DashboardView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [salesStats, setSalesStats] = useState<SalesStats | null>(null);
  const [orderCounts, setOrderCounts] = useState<OrderCounts | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [salesTrend, setSalesTrend] = useState<SalesTrendData[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      const [salesRes, ordersRes, topProductsRes, recentOrdersRes, trendRes] = await Promise.all([
        fetch('/api/analytics/sales'),
        fetch('/api/analytics/orders'),
        fetch('/api/analytics/top-products?limit=5'),
        fetch('/api/analytics/recent-orders?limit=5'),
        fetch('/api/analytics/sales-trend?days=7'),
      ]);

      const [sales, orders, products, recent, trend] = await Promise.all([
        salesRes.json(),
        ordersRes.json(),
        topProductsRes.json(),
        recentOrdersRes.json(),
        trendRes.json(),
      ]);

      setSalesStats(sales);
      setOrderCounts(orders);
      setTopProducts(products);
      setRecentOrders(recent);
      setSalesTrend(trend);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = {
    labels: salesTrend.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Sales (€)',
        data: salesTrend.map(d => d.sales),
        borderColor: '#000000',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#000',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e5e5',
        },
        ticks: {
          callback: (value) => `€${value}`,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend 
  }: { 
    title: string; 
    value: string; 
    subtitle: string; 
    icon: any; 
    trend?: string;
  }) => (
    <div className="bg-white rounded-lg border border-border p-[24px] hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-[16px]">
        <div className="p-[12px] bg-grey-10 rounded-lg">
          <Icon className="w-[24px] h-[24px] text-foreground" />
        </div>
        {trend && (
          <div className="flex items-center gap-[4px] text-[12px] font-medium text-green-600">
            <TrendingUp className="w-[14px] h-[14px]" />
            {trend}
          </div>
        )}
      </div>
      <div className="text-[28px] font-bold text-foreground mb-[4px]">{value}</div>
      <div className="text-[12px] text-grey-40 uppercase font-medium">{title}</div>
      <div className="text-[10px] text-grey-40 mt-[4px]">{subtitle}</div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-[40px] h-[40px] border-4 border-grey-20 border-t-primary rounded-full animate-spin mb-[16px]"></div>
          <div className="text-[14px] text-grey-40 uppercase font-medium">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px] mb-[40px]">
        <StatCard
          title="Today's Sales"
          value={`€${salesStats?.today.toFixed(2) || '0.00'}`}
          subtitle="Sales made today"
          icon={DollarSign}
        />
        <StatCard
          title="This Week"
          value={`€${salesStats?.week.toFixed(2) || '0.00'}`}
          subtitle="Last 7 days"
          icon={TrendingUp}
        />
        <StatCard
          title="This Month"
          value={`€${salesStats?.month.toFixed(2) || '0.00'}`}
          subtitle="Last 30 days"
          icon={DollarSign}
        />
        <StatCard
          title="Total Orders"
          value={`${salesStats?.totalOrders || 0}`}
          subtitle="All time"
          icon={ShoppingCart}
        />
      </div>

      {/* Orders Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[20px] mb-[40px]">
        <div className="bg-white rounded-lg border border-border p-[20px] text-center hover:shadow-md transition-shadow">
          <div className="text-[32px] font-bold text-yellow-600">{orderCounts?.pending || 0}</div>
          <div className="text-[12px] text-grey-40 uppercase font-medium mt-[8px]">Pending</div>
        </div>
        <div className="bg-white rounded-lg border border-border p-[20px] text-center hover:shadow-md transition-shadow">
          <div className="text-[32px] font-bold text-blue-600">{orderCounts?.preparing || 0}</div>
          <div className="text-[12px] text-grey-40 uppercase font-medium mt-[8px]">Preparing</div>
        </div>
        <div className="bg-white rounded-lg border border-border p-[20px] text-center hover:shadow-md transition-shadow">
          <div className="text-[32px] font-bold text-green-600">{orderCounts?.completed || 0}</div>
          <div className="text-[12px] text-grey-40 uppercase font-medium mt-[8px]">Completed</div>
        </div>
        <div className="bg-white rounded-lg border border-border p-[20px] text-center hover:shadow-md transition-shadow">
          <div className="text-[32px] font-bold text-red-600">{orderCounts?.cancelled || 0}</div>
          <div className="text-[12px] text-grey-40 uppercase font-medium mt-[8px]">Cancelled</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[40px]">
        {/* Sales Trend Chart */}
        <div className="bg-white rounded-lg border border-border p-[24px] hover:shadow-md transition-shadow">
          <h2 className="text-[18px] font-bold text-foreground uppercase mb-[24px]">Sales Trend (7 Days)</h2>
          <div className="h-[300px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg border border-border p-[24px] hover:shadow-md transition-shadow">
          <h2 className="text-[18px] font-bold text-foreground uppercase mb-[24px]">Top Selling Products</h2>
          <div className="space-y-[16px]">
            {topProducts.length === 0 ? (
              <div className="text-center py-[40px] text-grey-40 text-[14px]">No sales data yet</div>
            ) : (
              topProducts.map((product, idx) => (
                <div key={product.productId} className="flex items-center justify-between p-[16px] bg-grey-10 rounded-lg hover:bg-grey-20 transition-colors">
                  <div className="flex items-center gap-[12px]">
                    <div className="w-[32px] h-[32px] bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-[14px]">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-foreground">{product.productName}</div>
                      <div className="text-[12px] text-grey-40">{product.totalQuantity} sold</div>
                    </div>
                  </div>
                  <div className="text-[16px] font-bold text-foreground">€{product.totalRevenue.toFixed(2)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-[40px] bg-white rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-[24px] border-b border-border">
          <h2 className="text-[18px] font-bold text-foreground uppercase">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-grey-10 border-b border-border">
                <th className="text-left py-[12px] px-[16px] text-[12px] font-bold text-grey-40 uppercase">Order #</th>
                <th className="text-left py-[12px] px-[16px] text-[12px] font-bold text-grey-40 uppercase">Customer</th>
                <th className="text-left py-[12px] px-[16px] text-[12px] font-bold text-grey-40 uppercase">Amount</th>
                <th className="text-left py-[12px] px-[16px] text-[12px] font-bold text-grey-40 uppercase">Status</th>
                <th className="text-left py-[12px] px-[16px] text-[12px] font-bold text-grey-40 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-[40px] text-grey-40 text-[14px]">No orders yet</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-grey-10 transition-colors">
                    <td className="py-[16px] px-[16px] text-[14px] font-medium text-foreground">{order.orderNumber}</td>
                    <td className="py-[16px] px-[16px] text-[14px] text-foreground">{order.customerName}</td>
                    <td className="py-[16px] px-[16px] text-[14px] font-bold text-foreground">€{order.totalAmount.toFixed(2)}</td>
                    <td className="py-[16px] px-[16px]">
                      <span className={`px-[12px] py-[4px] rounded text-[10px] font-bold uppercase ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'preparing' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-[16px] px-[16px] text-[14px] text-grey-40">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};