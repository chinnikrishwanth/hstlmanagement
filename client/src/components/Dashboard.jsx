import React from 'react';
import { Users, DollarSign, Home, TrendingUp } from 'lucide-react';

export default function Dashboard({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Students Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Students</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.totalStudents || 0}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-sm text-green-600 font-medium">
            +{stats?.activeStudents || 0} Active
          </span>
        </div>
      </div>

      {/* Monthly Revenue Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
            <p className="text-3xl font-bold text-gray-900">₹{stats?.monthlyRevenue || 0}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-sm text-green-600 font-medium">
            +{stats?.paidPayments || 0} Payments
          </span>
        </div>
      </div>

      {/* Occupancy Rate Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.occupancyRate || 0}%</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-full">
            <Home className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-sm text-gray-600">
            {stats?.occupiedRooms || 0}/{stats?.totalRooms || 50} Rooms
          </span>
        </div>
      </div>

      {/* Pending Payments Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending Payments</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.pendingPayments || 0}</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-full">
            <TrendingUp className="h-6 w-6 text-orange-600" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-sm text-orange-600 font-medium">
            ₹{stats?.pendingAmount || 0} Due
          </span>
        </div>
      </div>
    </div>
  );
}
