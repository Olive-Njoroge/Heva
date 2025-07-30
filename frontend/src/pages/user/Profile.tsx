import React, { useState, useEffect } from 'react';
import { Save, User, Briefcase, MapPin, Calendar, Instagram, Globe, Music, CheckCircle, Clock, Circle } from 'lucide-react';
import { Layout } from '../../components/shared/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    businessName: user?.businessName || '',
    industry: user?.industry || '',
    location: user?.location || '',
    yearsInBusiness: user?.yearsInBusiness || 0,
    phone: user?.phone || '',
    website: user?.website || '',
    instagram: user?.instagram || '',
    linkedin: user?.linkedin || '',
    bio: user?.bio || '',
    specialties: user?.specialties || [],
    revenueModel: user?.revenueModel || 'project-based'
  });

  // Update form data when user changes (e.g., after login)
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        businessName: user.businessName || '',
        industry: user.industry || '',
        location: user.location || '',
        yearsInBusiness: user.yearsInBusiness || 0,
        phone: user.phone || '',
        website: user.website || '',
        instagram: user.instagram || '',
        linkedin: user.linkedin || '',
        bio: user.bio || '',
        specialties: user.specialties || [],
        revenueModel: user.revenueModel || 'project-based'
      });
    }
  }, [user]);

  const industries = [
    'Fashion', 'Film', 'Music', 'Digital Art', 'Performing Arts', 'Visual Arts',
    'Photography', 'Design', 'Writing', 'Architecture', 'Crafts', 'Other'
  ];

  const revenueModels = [
    { value: 'project-based', label: 'Project-Based' },
    { value: 'subscription', label: 'Subscription/Recurring' },
    { value: 'product-sales', label: 'Product Sales' },
    { value: 'service-based', label: 'Service-Based' },
    { value: 'mixed', label: 'Mixed Revenue Streams' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    setSaveMessage(''); // Clear any previous save messages
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      // Update the user data
      const success = await updateUser({
        ...formData,
        lastActivity: new Date().toISOString()
      });

      if (success) {
        setIsEditing(false);
        setHasChanges(false);
        setSaveMessage('Profile updated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Failed to update profile. Please try again.');
      }
    } catch (error) {
      setSaveMessage('An error occurred while saving. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setHasChanges(false);
    setSaveMessage('');
    
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        businessName: user.businessName || '',
        industry: user.industry || '',
        location: user.location || '',
        yearsInBusiness: user.yearsInBusiness || 0,
        phone: user.phone || '',
        website: user.website || '',
        instagram: user.instagram || '',
        linkedin: user.linkedin || '',
        bio: user.bio || '',
        specialties: user.specialties || [],
        revenueModel: user.revenueModel || 'project-based'
      });
    }
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const requiredFields = [
      'name', 'email', 'businessName', 'industry', 'location', 'bio'
    ];
    const optionalFields = [
      'phone', 'website', 'instagram', 'linkedin'
    ];
    
    const completedRequired = requiredFields.filter(field => 
      formData[field as keyof typeof formData] && 
      String(formData[field as keyof typeof formData]).trim() !== ''
    ).length;
    
    const completedOptional = optionalFields.filter(field => 
      formData[field as keyof typeof formData] && 
      String(formData[field as keyof typeof formData]).trim() !== ''
    ).length;
    
    const requiredWeight = 70; // Required fields are worth 70%
    const optionalWeight = 30; // Optional fields are worth 30%
    
    const requiredPercentage = (completedRequired / requiredFields.length) * requiredWeight;
    const optionalPercentage = (completedOptional / optionalFields.length) * optionalWeight;
    
    return Math.round(requiredPercentage + optionalPercentage);
  };

  const profileCompletion = calculateProfileCompletion();

  return (
    <Layout isAdmin={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600">Manage your personal and business information</p>
          </div>
          
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleSave} 
                  disabled={!hasChanges || isSaving}
                  isLoading={isSaving}
                >
                  <Save size={16} className="mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Save Success/Error Message */}
        {saveMessage && (
          <div className={`p-4 rounded-lg ${
            saveMessage.includes('successfully') 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {saveMessage}
          </div>
        )}

        {/* Profile Overview */}
        <Card>
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{formData.name || 'Name not set'}</h2>
              <p className="text-gray-600">{formData.businessName || 'Business name not set'}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Briefcase size={14} />
                  <span>{formData.industry || 'Industry not set'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin size={14} />
                  <span>{formData.location || 'Location not set'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>{formData.yearsInBusiness} years in business</span>
                </div>
              </div>
            </div>
            {user?.creditScore && (
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{user.creditScore}</div>
                <div className="text-sm text-gray-600">Credit Score</div>
              </div>
            )}
          </div>
        </Card>

        {/* Basic Information */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                placeholder="(555) 123-4567"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                disabled={!isEditing}
                placeholder="City, State"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio *
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!isEditing}
              rows={4}
              placeholder="Tell us about your creative journey and expertise..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        </Card>

        {/* Business Information */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Business Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry *
              </label>
              <select
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="">Select Industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years in Business
              </label>
              <input
                type="number"
                value={formData.yearsInBusiness}
                onChange={(e) => handleInputChange('yearsInBusiness', parseInt(e.target.value) || 0)}
                disabled={!isEditing}
                min="0"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Revenue Model
              </label>
              <select
                value={formData.revenueModel}
                onChange={(e) => handleInputChange('revenueModel', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              >
                {revenueModels.map(model => (
                  <option key={model.value} value={model.value}>{model.label}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Online Presence */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Online Presence</h3>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Globe size={16} className="mr-2" />
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                disabled={!isEditing}
                placeholder="https://yourwebsite.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Instagram size={16} className="mr-2" />
                  Instagram
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                  disabled={!isEditing}
                  placeholder="@yourusername"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Music size={16} className="mr-2" />
                  LinkedIn
                </label>
                <input
                  type="text"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  disabled={!isEditing}
                  placeholder="linkedin.com/in/yourprofile"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Completion */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Profile completeness</span>
              <span className="text-sm font-medium">{profileCompletion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
            
            <div className="mt-4 space-y-2 text-sm">
              <div className={`flex items-center ${formData.name && formData.email ? 'text-green-600' : 'text-gray-400'}`}>
                {formData.name && formData.email ? (
                  <CheckCircle size={16} className="mr-2" />
                ) : (
                  <Circle size={16} className="mr-2" />
                )}
                Basic information completed
              </div>
              <div className={`flex items-center ${formData.businessName && formData.industry ? 'text-green-600' : 'text-gray-400'}`}>
                {formData.businessName && formData.industry ? (
                  <CheckCircle size={16} className="mr-2" />
                ) : (
                  <Circle size={16} className="mr-2" />
                )}
                Business details added
              </div>
              <div className={`flex items-center ${formData.bio ? 'text-green-600' : 'text-yellow-600'}`}>
                {formData.bio ? (
                  <CheckCircle size={16} className="mr-2" />
                ) : (
                  <Clock size={16} className="mr-2" />
                )}
                Professional bio {formData.bio ? 'completed' : 'needed'}
              </div>
              <div className={`flex items-center ${formData.website || formData.instagram || formData.linkedin ? 'text-green-600' : 'text-gray-400'}`}>
                {formData.website || formData.instagram || formData.linkedin ? (
                  <CheckCircle size={16} className="mr-2" />
                ) : (
                  <Circle size={16} className="mr-2" />
                )}
                Online presence {formData.website || formData.instagram || formData.linkedin ? 'connected' : 'needed'}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}