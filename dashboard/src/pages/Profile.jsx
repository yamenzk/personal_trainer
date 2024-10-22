import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Activity, User, Settings, LogOut, ChevronRight,
  Calendar, Mail, Phone, MapPin, Weight, Target,
  Dumbbell, Clock, Goal, Apple, Heart, TrendingUp,
  Sparkles, Award, Zap, BarChart, ArrowUpRight,
  ArrowDownRight, Coffee, Flame, Info
} from 'lucide-react';

// Helper Components
const AnimatedBar = ({ value, maxValue, color }) => (
  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
    <div 
      className={`h-full ${color} transition-all duration-1000 ease-out`}
      style={{ width: `${(value / maxValue) * 100}%` }}
    />
  </div>
);

const StatCard = ({ icon: Icon, label, value, trend, color = "text-brand" }) => (
  <div className="relative group">
    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-300 group-hover:border-brand/50">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl bg-gray-100 dark:bg-gray-900 ${color} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-lg font-semibold dark:text-white">{value}</p>
          </div>
        </div>
        {trend && (
          <div className={`
            flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium
            ${trend > 0 
              ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30' 
              : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30'}
          `}>
            {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

const AchievementCard = ({ icon: Icon, label, value, progress }) => (
  <div className="relative overflow-hidden">
    <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-xl bg-brand/10 text-brand">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium dark:text-white">{label}</p>
            <p className="text-sm text-brand font-semibold">{value}</p>
          </div>
          <div className="mt-2">
            <AnimatedBar value={progress} maxValue={100} color="bg-brand" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TabButton = ({ active, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`
      relative min-w-[120px] py-3 px-6
      flex items-center justify-center gap-2
      transition-all duration-300
      ${active 
        ? 'text-brand' 
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
      }
    `}
  >
    <Icon className={`w-4 h-4 transition-transform duration-300 ${active ? 'scale-110' : ''}`} />
    <span className="font-medium">{children}</span>
    {active && (
      <>
        {/* Active indicator line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full" />
        {/* Glowing effect */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand blur-sm" />
      </>
    )}
  </button>
);

const InfoCard = ({ icon: Icon, label, value, action }) => (
  <div 
    onClick={action}
    className={`
      p-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg
      border border-gray-200/50 dark:border-gray-700/50
      transition-all duration-300 hover:border-brand/20
      ${action ? 'cursor-pointer active:scale-[0.98]' : ''}
    `}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-900 text-brand">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="font-medium dark:text-white">{value}</p>
        </div>
      </div>
      {action && <ChevronRight className="w-5 h-5 text-gray-400" />}
    </div>
  </div>
);

const PreferenceCard = ({ icon: Icon, label, value, description }) => (
  <div className="p-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg 
                  border border-gray-200/50 dark:border-gray-700/50">
    <div className="flex items-start space-x-3">
      <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-900 text-brand mt-1">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-medium dark:text-white">{label}</p>
          <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-sm">
            {value}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>
    </div>
  </div>
);

const ProfilePage = () => {
  const { clientData, logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    setIsAnimated(false);
    await new Promise(resolve => setTimeout(resolve, 300));
    logout();
    addToast('Successfully logged out', 'info');
    navigate('/login');
  };

  if (!clientData?.client) return null;
  const client = clientData.client;

  // Format weight data for chart
  const weightData = client.weight_log?.map(log => ({
    date: new Date(log.date).toLocaleDateString(),
    weight: log.weight,
    target: client.weight_goal
  })) || [];

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    
    return (
      <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">{payload[0].payload.date}</p>
        <div className="mt-2 space-y-1">
          <p className="text-sm font-medium text-brand">
            Weight: {payload[0].value} kg
          </p>
          <p className="text-sm font-medium text-blue-500">
            Target: {payload[1].value} kg
          </p>
        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Progress Chart */}
      <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg 
                      border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold dark:text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-brand" />
            <span>Weight Progress</span>
          </h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-brand" />
              <span className="text-gray-600 dark:text-gray-400">Current</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-gray-600 dark:text-gray-400">Target</span>
            </div>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData}>
              <XAxis 
                dataKey="date" 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#e03a08" 
                strokeWidth={2}
                dot={{ fill: '#e03a08', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#3b82f6" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={Target}
          label="Target Weight"
          value={`${client.weight_goal} kg`}
          color="text-blue-500"
        />
        <StatCard
          icon={Activity}
          label="Weekly Progress"
          value="On Track"
          trend={12}
          color="text-green-500"
        />
        <StatCard
          icon={Flame}
          label="Daily Calories"
          value={`${client.energy_target} kcal`}
          color="text-orange-500"
        />
        <StatCard
          icon={Heart}
          label="Active Days"
          value="5 days"
          trend={8}
          color="text-red-500"
        />
      </div>

      {/* Achievements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold dark:text-white flex items-center space-x-2">
          <Award className="w-5 h-5 text-brand" />
          <span>Monthly Achievements</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AchievementCard
            icon={Dumbbell}
            label="Workout Streak"
            value="18/20 days"
            progress={90}
          />
          <AchievementCard
            icon={Target}
            label="Weight Goal Progress"
            value="8.5/10 kg"
            progress={85}
          />
          <AchievementCard
            icon={Apple}
            label="Nutrition Goals"
            value="12/15 days"
            progress={80}
          />
          <AchievementCard
            icon={Zap}
            label="Activity Score"
            value="850/1000 pts"
            progress={85}
          />
        </div>
      </div>

      {/* Nutrition Goals */}
      <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg 
                      border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold mb-6 dark:text-white flex items-center space-x-2">
          <Apple className="w-5 h-5 text-brand" />
          <span>Daily Nutrition Goals</span>
        </h3>
        <div className="space-y-6">
          {[
            { label: 'Protein', value: client.protein_target, unit: 'g', color: 'bg-blue-500', current: client.protein_target * 0.8 },
            { label: 'Carbs', value: client.carb_target, unit: 'g', color: 'bg-green-500', current: client.carb_target * 0.7 },
            { label: 'Fat', value: client.fat_target, unit: 'g', color: 'bg-yellow-500', current: client.fat_target * 0.6 },
            { label: 'Water', value: client.water_target, unit: 'ml', color: 'bg-cyan-500', current: client.water_target * 0.9 }
          ].map(({ label, value, unit, color, current }) => (
            <div key={label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{label}</span>
              <span className="font-medium dark:text-white">
                {current}/{value} {unit}
              </span>
            </div>
            <AnimatedBar value={current} maxValue={value} color={color} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const renderPersonalInfo = () => (
  <div className="space-y-4">
    {[
      { icon: User, label: 'Full Name', value: client.client_name },
      { icon: Mail, label: 'Email', value: client.email, action: () => window.location.href = `mailto:${client.email}` },
      { icon: Phone, label: 'Mobile', value: client.mobile || 'Not set', action: client.mobile && (() => window.location.href = `tel:${client.mobile}`) },
      { icon: Calendar, label: 'Date of Birth', value: new Date(client.date_of_birth).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      })},
      { icon: MapPin, label: 'Location', value: client.location || 'Not specified' },
      { icon: Weight, label: 'Current Weight', value: `${client.weight_log?.[client.weight_log.length - 1]?.weight || '-'} kg` },
      { icon: Target, label: 'Target Weight', value: `${client.weight_goal} kg` },
      { icon: Info, label: 'Height', value: `${client.height} cm` },
    ].map(item => (
      <InfoCard
        key={item.label}
        icon={item.icon}
        label={item.label}
        value={item.value}
        action={item.action}
      />
    ))}
  </div>
);

const renderPreferences = () => (
  <div className="space-y-4">
    {[
      { 
        icon: Dumbbell, 
        label: 'Workout Location',
        value: client.workout_preference,
        description: 'Your preferred training environment'
      },
      { 
        icon: Clock,
        label: 'Workout Schedule',
        value: client.workout_split,
        description: 'Your weekly training frequency'
      },
      { 
        icon: Goal,
        label: 'Fitness Goal',
        value: client.goal,
        description: 'Your primary training objective'
      },
      { 
        icon: Apple,
        label: 'Meal Frequency',
        value: client.meal_split,
        description: 'Your daily meal distribution'
      },
      { 
        icon: Coffee,
        label: 'Recovery Time',
        value: client.recovery_preference || '24-48 hours',
        description: 'Preferred rest between workouts'
      }
    ].map(item => (
      <PreferenceCard
        key={item.label}
        icon={item.icon}
        label={item.label}
        value={item.value}
        description={item.description}
      />
    ))}
  </div>
);

return (
  <div className="bg-gray-50 dark:bg-gray-900 pb-[calc(var(--footer-height)+5rem)]">
    <div className="max-w-2xl mx-auto px-4 pt-4">
      {/* Profile Card */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-80" />
        <div className="relative p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50">
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={() => {}}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              {client.image ? (
                <img
                  src={client.image}
                  alt={client.client_name}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-brand/20"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand/20 to-brand/30 flex items-center justify-center group">
                  <User className="w-8 h-8 text-brand group-hover:scale-110 transition-transform duration-300" />
                </div>
              )}
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-brand animate-pulse" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold dark:text-white">
                {client.client_name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Member since {new Date(client.creation).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-medium">
                  {client.goal}
                </span>
                <span className="px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium">
                  Active Member
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 p-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700">
          <div className="px-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Current</p>
            <p className="text-lg font-semibold text-brand mt-1">
              {client.weight_log?.[client.weight_log.length - 1]?.weight || '-'} kg
            </p>
          </div>
          <div className="px-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Target</p>
            <p className="text-lg font-semibold text-blue-500 mt-1">
              {client.weight_goal} kg
            </p>
          </div>
          <div className="px-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">To Go</p>
            <p className="text-lg font-semibold text-green-500 mt-1">
              {(() => {
                const currentWeight = client.weight_log?.[client.weight_log.length - 1]?.weight;
                if (!currentWeight) return '-';
                return `${Math.abs(currentWeight - client.weight_goal).toFixed(1)} kg`;
              })()}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 dark:border-gray-700">
          <TabButton 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
            icon={Activity}
          >
            Overview
          </TabButton>
          <TabButton 
            active={activeTab === 'personal'} 
            onClick={() => setActiveTab('personal')}
            icon={User}
          >
            Personal Info
          </TabButton>
          <TabButton 
            active={activeTab === 'preferences'} 
            onClick={() => setActiveTab('preferences')}
            icon={Settings}
          >
            Preferences
          </TabButton>
        </div>
      </div>

      {/* Tab Content */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'personal' && renderPersonalInfo()}
        {activeTab === 'preferences' && renderPreferences()}
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-[calc(var(--footer-height)+1rem)] left-0 right-0 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/chat')}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl
                         bg-brand text-white font-medium
                         transform transition-all duration-200
                         hover:bg-brand-600 active:scale-95"
              >
                <span>Message Trainer</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/workout-plans')}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl
                         bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium
                         transform transition-all duration-200
                         hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95"
              >
                <span>View Workouts</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default ProfilePage;