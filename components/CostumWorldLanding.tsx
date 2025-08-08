import React from 'react';
import { ChevronRight, Users, CreditCard, Shield, BarChart3 } from 'lucide-react';

const CostumWorldLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              costum<span className="text-blue-500">world</span>
            </h1>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            LOGIN
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            SIGN IN
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 py-12 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                Onepay online
              </h2>
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                One joy offert 😉
              </h3>
            </div>

            {/* Tech Stack Icons */}
            <div className="flex space-x-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-black rounded"></div>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">Xd</span>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg inline-block">
              <div className="text-3xl font-bold text-blue-500">220+</div>
              <div className="text-gray-600 font-medium">PRODUCTS AVAILABLE</div>
            </div>
          </div>

          {/* Right Side - Dashboard Mockups */}
          <div className="relative">
            {/* Main Dashboard */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-1 transition-transform duration-300">
              {/* Dashboard Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
                  <span className="font-semibold">Dashboard</span>
                </div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
                </div>
              </div>

              {/* Balance */}
              <div className="mb-6">
                <div className="text-2xl font-bold">$2,302.36</div>
                <div className="text-green-500 text-sm">+2.5% from last month</div>
              </div>

              {/* Transaction List */}
              <div className="space-y-3">
                {[
                  { name: 'Sarah Johnson', amount: '-$45.00', avatar: 'bg-pink-400' },
                  { name: 'Mike Chen', amount: '+$120.50', avatar: 'bg-blue-400' },
                  { name: 'Emma Wilson', amount: '-$32.75', avatar: 'bg-green-400' },
                  { name: 'David Brown', amount: '+$89.25', avatar: 'bg-purple-400' },
                ].map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${transaction.avatar} rounded-full`}></div>
                      <span className="font-medium">{transaction.name}</span>
                    </div>
                    <span className={`font-semibold ${transaction.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dark Theme Dashboard */}
            <div className="absolute -bottom-4 -right-4 bg-gray-900 text-white rounded-2xl shadow-2xl p-6 w-80 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Quick Transfer</span>
                <div className="flex space-x-1">
                  <div className="w-6 h-6 bg-orange-400 rounded-full"></div>
                  <div className="w-6 h-6 bg-blue-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-xl font-bold">$2,302.36</div>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'Payment Successful', status: 'completed', color: 'bg-green-500' },
                  { name: 'Pending Transfer', status: 'pending', color: 'bg-yellow-500' },
                  { name: 'Failed Payment', status: 'failed', color: 'bg-red-500' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2">
                    <div className={`w-2 h-2 ${item.color} rounded-full`}></div>
                    <span className="text-sm text-gray-300">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Circular Chart */}
            <div className="absolute top-4 right-4 bg-white rounded-2xl p-4 shadow-lg">
              <div className="w-16 h-16 relative">
                <div className="w-full h-full rounded-full border-4 border-gray-200">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent transform rotate-45"></div>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 space-y-3">
              <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
                <Users className="w-8 h-8 text-blue-500 mb-2" />
                <div className="text-sm font-medium">Team Management</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
                <BarChart3 className="w-8 h-8 text-green-500 mb-2" />
                <div className="text-sm font-medium">Analytics</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2">
          <span>Get Started</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CostumWorldLanding;