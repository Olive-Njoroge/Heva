import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, MessageCircle, Mail, Phone, FileText, Video, ExternalLink } from 'lucide-react';
import { Layout } from '../../components/shared/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'video' | 'article';
  url: string;
  duration?: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How is my credit score calculated?',
    answer: 'Your HEVA credit score is calculated using five key factors: Payment History (35%), Portfolio Performance (25%), Industry Stability (20%), Business Growth (15%), and Risk Factors (5%). Each factor is weighted based on its importance to creative professionals.',
    category: 'scoring'
  },
  {
    id: '2',
    question: 'What documents do I need to upload?',
    answer: 'Required documents include: bank statements (last 3 months), business registration certificate, tax returns (previous year), identity verification, and proof of business address. Optional documents like portfolio samples and client testimonials can improve your score.',
    category: 'documents'
  },
  {
    id: '3',
    question: 'How long does the application process take?',
    answer: 'The application process typically takes 3-5 business days once all required documents are submitted. You\'ll receive email updates throughout the process, and can track your application status in your dashboard.',
    category: 'application'
  },
  {
    id: '4',
    question: 'Why was my application rejected?',
    answer: 'Applications may be rejected due to insufficient income documentation, incomplete portfolio information, or credit history concerns. You can reapply after addressing the specific issues mentioned in your rejection notice.',
    category: 'application'
  },
  {
    id: '5',
    question: 'How often is my credit score updated?',
    answer: 'Your credit score is updated monthly, typically around the 15th of each month. Major changes in your financial situation or portfolio performance may trigger more frequent updates.',
    category: 'scoring'
  },
  {
    id: '6',
    question: 'Can I improve my credit score?',
    answer: 'Yes! You can improve your score by maintaining consistent payment history, diversifying your portfolio, updating financial records regularly, collecting client testimonials, and demonstrating business growth.',
    category: 'scoring'
  },
  {
    id: '7',
    question: 'What makes HEVA different from traditional credit scoring?',
    answer: 'HEVA specializes in creative industries, considering factors like portfolio performance, seasonal revenue patterns, project-based income, and industry-specific metrics that traditional lenders often overlook.',
    category: 'general'
  },
  {
    id: '8',
    question: 'How do I update my profile information?',
    answer: 'You can update your profile information by going to the Profile section in your dashboard. Changes to business information may require document verification and could affect your credit assessment.',
    category: 'account'
  }
];

const resources: Resource[] = [
  {
    id: '1',
    title: 'Getting Started with HEVA',
    description: 'Complete guide to setting up your account and submitting your first application',
    type: 'guide',
    url: '#',
    duration: '10 min read'
  },
  {
    id: '2',
    title: 'Understanding Creative Credit Scoring',
    description: 'Deep dive into how HEVA evaluates creative professionals differently',
    type: 'video',
    url: '#',
    duration: '15 min'
  },
  {
    id: '3',
    title: 'Document Preparation Checklist',
    description: 'Ensure you have all required documents before applying',
    type: 'guide',
    url: '#',
    duration: '5 min read'
  },
  {
    id: '4',
    title: 'Building a Strong Creative Portfolio',
    description: 'Tips for showcasing your work to improve your credit profile',
    type: 'article',
    url: '#',
    duration: '8 min read'
  },
  {
    id: '5',
    title: 'Managing Seasonal Revenue Patterns',
    description: 'How to handle irregular income in creative industries',
    type: 'video',
    url: '#',
    duration: '12 min'
  },
  {
    id: '6',
    title: 'Industry-Specific Credit Tips',
    description: 'Tailored advice for fashion, film, music, and digital artists',
    type: 'guide',
    url: '#',
    duration: '20 min read'
  }
];

const categories = [
  { key: 'all', label: 'All Questions' },
  { key: 'general', label: 'General' },
  { key: 'scoring', label: 'Credit Scoring' },
  { key: 'application', label: 'Applications' },
  { key: 'documents', label: 'Documents' },
  { key: 'account', label: 'Account Management' }
];

export function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    alert('Your message has been sent! We\'ll get back to you within 24 hours.');
    setContactForm({ subject: '', message: '', priority: 'medium' });
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video size={16} className="text-red-500" />;
      case 'guide':
        return <FileText size={16} className="text-blue-500" />;
      case 'article':
        return <FileText size={16} className="text-green-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };

  return (
    <Layout isAdmin={false}>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions, access helpful resources, or get in touch with our support team
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hover className="text-center cursor-pointer">
            <MessageCircle size={32} className="text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 mb-4">Get instant help from our support team</p>
            <Button variant="outline" size="sm" onClick={() => window.open('https://wa.me/+254714897692', '_blank')}>Start Chat</Button>
          </Card>

          <Card hover className="text-center cursor-pointer">
            <Mail size={32} className="text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-gray-600 mb-4">Send us a detailed message</p>
            <Button variant="outline" size="sm" onClick={() => window.open('mailto:support@heva.com?subject=Support%20Request')}>Send Email</Button>
          </Card>

          <Card hover className="text-center cursor-pointer">
            <Phone size={32} className="text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-sm text-gray-600 mb-4">Speak directly with our team</p>
            <Button variant="outline" size="sm" onClick={() => window.open('tel:+254714897692')}>Call Now</Button>
          </Card>
        </div>

        {/* Search and FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-3">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
              
              {/* Search */}
              <div className="relative mb-6">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* FAQ Items */}
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {expandedFAQ === faq.id ? (
                        <ChevronDown size={16} className="text-gray-500" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-500" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No questions found matching your search.</p>
                </div>
              )}
            </Card>
          </div>

          {/* Category Filter */}
          <div>
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.key
                        ? 'bg-blue-100 text-blue-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* Contact Hours */}
            <Card className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Support Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="text-gray-900">9 AM - 6 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="text-gray-900">10 AM - 4 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="text-gray-900">Closed</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Emergency support available 24/7 for critical issues
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Resources */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Helpful Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start space-x-3">
                  {getResourceIcon(resource.type)}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{resource.duration}</span>
                      <Button variant="ghost" size="sm">
                        <ExternalLink size={12} className="mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Contact Form */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Still Need Help?</h2>
          
          <form onSubmit={handleSubmitContact} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={contactForm.priority}
                  onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="medium">Medium - Account issue</option>
                  <option value="high">High - Urgent problem</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please provide as much detail as possible about your issue..."
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                We typically respond within 24 hours
              </p>
              <Button type="submit" variant="primary" onClick={() => window.open('https://wa.me/+254714897692', '_blank')}>
                Send Message
              </Button>
            </div>
          </form>
        </Card>

        {/* Additional Support */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <MessageCircle size={24} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Need Immediate Help?</h3>
          </div>
          <p className="text-blue-800 mb-4">
            Our AI-powered chatbot is available 24/7 to help with common questions and can escalate complex issues to our human support team.
          </p>
          <Button variant="primary" size="sm">
            Chat with HEVA Assistant
          </Button>
        </div>
      </div>
    </Layout>
  );
}