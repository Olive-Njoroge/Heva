import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Info, Calculator, Target, Lightbulb } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Layout } from '../../components/shared/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

// Mock data
const scoreHistory = [
  { month: 'Jul 23', score: 680, change: 0 },
  { month: 'Aug 23', score: 695, change: 15 },
  { month: 'Sep 23', score: 715, change: 20 },
  { month: 'Oct 23', score: 728, change: 13 },
  { month: 'Nov 23', score: 735, change: 7 },
  { month: 'Dec 23', score: 742, change: 7 },
];

const factorBreakdown = [
  { factor: 'Payment History', weight: 35, score: 92, impact: 'positive' },
  { factor: 'Portfolio Performance', weight: 25, score: 78, impact: 'positive' },
  { factor: 'Industry Stability', weight: 20, score: 68, impact: 'neutral' },
  { factor: 'Business Growth', weight: 15, score: 85, impact: 'positive' },
  { factor: 'Risk Factors', weight: 5, score: 90, impact: 'positive' }
];

const radarData = [
  { subject: 'Payment History', current: 92, industry: 75 },
  { subject: 'Portfolio', current: 78, industry: 70 },
  { subject: 'Stability', current: 68, industry: 72 },
  { subject: 'Growth', current: 85, industry: 68 },
  { subject: 'Risk Management', current: 90, industry: 80 }
];

const industryComparison = {
  fashion: { avgScore: 698, percentile: 78 },
  film: { avgScore: 681, percentile: 82 },
  music: { avgScore: 712, percentile: 71 },
  digital: { avgScore: 724, percentile: 68 }
};

const improvementSuggestions = [
  {
    title: 'Increase Portfolio Diversity',
    description: 'Add 2-3 different project types to show versatility',
    impact: '+12-18 points',
    timeframe: '2-3 months',
    priority: 'high'
  },
  {
    title: 'Update Financial Records',
    description: 'Upload recent bank statements and tax returns',
    impact: '+5-8 points',
    timeframe: '1 week',
    priority: 'medium'
  },
  {
    title: 'Build Client Testimonials',
    description: 'Collect and submit 3-5 detailed client reviews',
    impact: '+8-12 points',
    timeframe: '1 month',
    priority: 'high'
  },
  {
    title: 'Optimize Social Media Presence',
    description: 'Maintain consistent posting and engagement',
    impact: '+3-6 points',
    timeframe: '2 months',
    priority: 'low'
  }
];

export function Score() {
  const { user } = useAuth();
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorValues, setCalculatorValues] = useState({
    paymentHistory: 92,
    portfolioPerformance: 78,
    industryStability: 68,
    businessGrowth: 85,
    riskFactors: 90
  });

  const currentScore = user?.creditScore || 742;
  const currentIndustry = user?.industry || 'Fashion';

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 750) return 'from-green-400 to-green-600';
    if (score >= 650) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const getTierInfo = (score: number) => {
    if (score >= 750) return { tier: 'Rising Star', description: 'Excellent credit profile with strong growth potential' };
    if (score >= 650) return { tier: 'Growing Talent', description: 'Good credit profile with room for improvement' };
    return { tier: 'Emerging Artist', description: 'Building credit profile with foundational strength' };
  };

  const calculateEstimatedScore = () => {
    const weights = { paymentHistory: 0.35, portfolioPerformance: 0.25, industryStability: 0.20, businessGrowth: 0.15, riskFactors: 0.05 };
    return Math.round(
      (calculatorValues.paymentHistory * weights.paymentHistory +
       calculatorValues.portfolioPerformance * weights.portfolioPerformance +
       calculatorValues.industryStability * weights.industryStability +
       calculatorValues.businessGrowth * weights.businessGrowth +
       calculatorValues.riskFactors * weights.riskFactors) * 8.5 + 100
    );
  };

  const tierInfo = getTierInfo(currentScore);
  const comparison = industryComparison[currentIndustry.toLowerCase() as keyof typeof industryComparison] || industryComparison.fashion;

  return (
    <Layout isAdmin={false}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Credit Score Details</h1>
          <p className="text-gray-600">Understanding your creative credit profile</p>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Score Display */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Your Credit Score</h2>
                  <p className="text-sm text-gray-600">{tierInfo.description}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowCalculator(!showCalculator)}>
                  <Calculator size={16} className="mr-2" />
                  Score Calculator
                </Button>
              </div>

              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className={`w-44 h-44 rounded-full bg-gradient-to-r ${getScoreGradient(currentScore)} flex items-center justify-center`}>
                      <div className="w-36 h-36 rounded-full bg-white flex flex-col items-center justify-center">
                        <span className={`text-4xl font-bold ${getScoreColor(currentScore)}`}>
                          {currentScore}
                        </span>
                        <span className="text-sm text-gray-600 mt-1">{tierInfo.tier}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Score Range Indicators */}
                  <div className="absolute -bottom-4 left-0 right-0 flex justify-between text-xs text-gray-500">
                    <span>300</span>
                    <span>500</span>
                    <span>650</span>
                    <span>750</span>
                    <span>850</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-green-600">
                    <TrendingUp size={16} />
                    <span className="font-medium">+7</span>
                  </div>
                  <span className="text-gray-600">This Month</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-green-600">
                    <TrendingUp size={16} />
                    <span className="font-medium">+62</span>
                  </div>
                  <span className="text-gray-600">Last 6 Months</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Industry Comparison */}
          <div className="space-y-6">
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Industry Comparison</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Your Score</span>
                    <span className={`font-bold ${getScoreColor(currentScore)}`}>{currentScore}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">{currentIndustry} Average</span>
                    <span className="font-medium text-gray-900">{comparison.avgScore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Your Percentile</span>
                    <span className="font-medium text-blue-600">{comparison.percentile}th</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-700">
                    You score higher than <strong>{comparison.percentile}%</strong> of {currentIndustry.toLowerCase()} professionals
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Next Review</h3>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">Feb 15</div>
                <div className="text-sm text-gray-600">2024</div>
                <p className="text-xs text-gray-500 mt-2">
                  Your score is updated monthly based on new data
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Score Calculator */}
        {showCalculator && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What-If Score Calculator</h3>
            <p className="text-gray-600 mb-6">Adjust the factors below to see how changes might affect your score</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {Object.entries(calculatorValues).map(([key, value]) => {
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  return (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">{label}</label>
                        <span className="text-sm text-gray-600">{value}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => setCalculatorValues(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {calculateEstimatedScore()}
                  </div>
                  <div className="text-sm text-gray-600">Estimated Score</div>
                  <div className="mt-4 text-xs text-gray-500">
                    Difference: {calculateEstimatedScore() - currentScore > 0 ? '+' : ''}{calculateEstimatedScore() - currentScore} points
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Score History Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Score History</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={scoreHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={['dataMin - 20', 'dataMax + 20']} />
              <Tooltip 
                formatter={(value, name) => [value, 'Credit Score']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Factor Breakdown and Radar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Factor Breakdown */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Factor Breakdown</h3>
            <div className="space-y-4">
              {factorBreakdown.map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{factor.factor}</span>
                      <span className="text-xs text-gray-500">({factor.weight}%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{factor.score}%</span>
                      {factor.impact === 'positive' ? (
                        <TrendingUp size={14} className="text-green-500" />
                      ) : factor.impact === 'negative' ? (
                        <TrendingDown size={14} className="text-red-500" />
                      ) : (
                        <div className="w-3 h-3 bg-gray-400 rounded-full" />
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        factor.score >= 80 ? 'bg-green-500' : 
                        factor.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Radar Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance vs Industry</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                <Radar
                  name="Your Score"
                  dataKey="current"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Industry Average"
                  dataKey="industry"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Improvement Suggestions */}
        <Card>
          <div className="flex items-center space-x-2 mb-6">
            <Lightbulb size={24} className="text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">Improvement Suggestions</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {improvementSuggestions.map((suggestion, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
                    suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {suggestion.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Impact: <strong className="text-green-600">{suggestion.impact}</strong></span>
                  <span>Timeline: <strong>{suggestion.timeframe}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Educational Content */}
        <Card>
          <div className="flex items-center space-x-2 mb-4">
            <Info size={20} className="text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">Understanding Your Score</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Score Ranges</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>300-579:</span>
                  <span className="text-red-600">Building</span>
                </div>
                <div className="flex justify-between">
                  <span>580-669:</span>
                  <span className="text-yellow-600">Fair</span>
                </div>
                <div className="flex justify-between">
                  <span>670-739:</span>
                  <span className="text-blue-600">Good</span>
                </div>
                <div className="flex justify-between">
                  <span>740-799:</span>
                  <span className="text-green-600">Very Good</span>
                </div>
                <div className="flex justify-between">
                  <span>800-850:</span>
                  <span className="text-green-700">Excellent</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Factors</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Payment history (35%)</li>
                <li>• Portfolio performance (25%)</li>
                <li>• Industry stability (20%)</li>
                <li>• Business growth (15%)</li>
                <li>• Risk management (5%)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Quick Tips</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Pay bills on time consistently</li>
                <li>• Maintain diverse project portfolio</li>
                <li>• Keep financial records updated</li>
                <li>• Build strong client relationships</li>
                <li>• Monitor your score regularly</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}