import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Download, Eye } from 'lucide-react';
import { Layout } from '../../components/shared/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

interface DocumentItem {
  id: string;
  name: string;
  category: string;
  status: 'verified' | 'pending' | 'rejected';
  uploadDate: string;
  size: string;
  type: string;
  required: boolean;
  description: string;
}

interface DocumentTemplate {
  name: string;
  category: string;
  id: string;
}

const documentCategories = [
  {
    name: 'Financial Documents',
    key: 'financial',
    description: 'Bank statements, tax returns, and financial records'
  },
  {
    name: 'Legal Documents',
    key: 'legal',
    description: 'Business registration, contracts, and legal filings'
  },
  {
    name: 'Portfolio Materials',
    key: 'portfolio',
    description: 'Work samples, case studies, and project documentation'
  },
  {
    name: 'References',
    key: 'references',
    description: 'Client testimonials, professional references, and endorsements'
  }
];

const mockDocuments: DocumentItem[] = [
  {
    id: '1',
    name: 'Bank Statement - December 2023',
    category: 'financial',
    status: 'verified',
    uploadDate: '2024-01-02',
    size: '1.2 MB',
    type: 'PDF',
    required: true,
    description: 'Latest bank statement showing business account activity'
  },
  {
    id: '2',
    name: 'Business Registration Certificate',
    category: 'legal',
    status: 'verified',
    uploadDate: '2024-01-01',
    size: '0.8 MB',
    type: 'PDF',
    required: true,
    description: 'Official business registration with state authorities'
  },
  {
    id: '3',
    name: 'Portfolio - Fashion Collection 2023',
    category: 'portfolio',
    status: 'pending',
    uploadDate: '2024-01-03',
    size: '15.4 MB',
    type: 'ZIP',
    required: false,
    description: 'Comprehensive portfolio of recent fashion designs'
  },
  {
    id: '4',
    name: 'Tax Return 2023',
    category: 'financial',
    status: 'rejected',
    uploadDate: '2023-12-28',
    size: '2.1 MB',
    type: 'PDF',
    required: true,
    description: 'Complete tax return for previous fiscal year'
  },
  {
    id: '5',
    name: 'Client Testimonials',
    category: 'references',
    status: 'verified',
    uploadDate: '2024-01-04',
    size: '0.5 MB',
    type: 'PDF',
    required: false,
    description: 'Collection of positive client feedback and reviews'
  }
];

export function Documents() {
  const [documents, setDocuments] = useState<DocumentItem[]>(mockDocuments);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [replaceModalOpen, setReplaceModalOpen] = useState(false);
  const [documentToReplace, setDocumentToReplace] = useState<DocumentItem | null>(null);

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'rejected':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <AlertCircle size={16} className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getCompletionStats = () => {
    const requiredDocs = documents.filter(doc => doc.required);
    const verifiedRequired = requiredDocs.filter(doc => doc.status === 'verified');
    return {
      required: requiredDocs.length,
      verified: verifiedRequired.length,
      percentage: Math.round((verifiedRequired.length / requiredDocs.length) * 100)
    };
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach((file) => {
      const newDoc: DocumentItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        category: 'financial', // Default category
        status: 'pending',
        uploadDate: new Date().toISOString().split('T')[0],
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        type: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
        required: false,
        description: 'Recently uploaded document'
      };
      
      setDocuments(prev => [...prev, newDoc]);
    });
    
    setUploadModalOpen(false);
  };

  const handleReplaceDocument = (files: FileList | null) => {
    if (!files || !documentToReplace) return;
    
    const file = files[0]; // Take only the first file for replacement
    
    // Create updated document with new file info but keep original metadata
    const updatedDoc: DocumentItem = {
      ...documentToReplace,
      name: file.name,
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      type: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
      status: 'pending', // Reset status to pending after replacement
      description: `Replaced document - ${documentToReplace.description}`
    };
    
    // Update the documents array
    setDocuments(prev => prev.map(doc => 
      doc.id === documentToReplace.id ? updatedDoc : doc
    ));
    
    // Close modals and reset state
    setReplaceModalOpen(false);
    setDocumentToReplace(null);
    setSelectedDocument(null);
    
    // Show success message
    alert(`Document "${file.name}" has been uploaded successfully and is pending verification.`);
  };

  // New handlers for required document uploads
  const handleRequiredDocUpload = (docTemplate: DocumentTemplate) => {
    const fileInput = document.getElementById(`upload-${docTemplate.id}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleRequiredDocFileChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    docTemplate: DocumentTemplate
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Create a new document object for the required document
    const newDoc: DocumentItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: `${docTemplate.name} - ${file.name}`,
      category: docTemplate.category,
      status: 'pending',
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      type: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
      required: true, // Mark as required document
      description: `Required document: ${docTemplate.name}`
    };
    
    // Add to documents state
    setDocuments(prev => [...prev, newDoc]);
    
    // Clear the input for future uploads
    e.target.value = '';
    
    // Show success message
    alert(`"${docTemplate.name}" has been uploaded successfully and is pending verification.`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (replaceModalOpen) {
      handleReplaceDocument(e.dataTransfer.files);
    } else {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDelete = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const openReplaceModal = (document: DocumentItem) => {
    setDocumentToReplace(document);
    setReplaceModalOpen(true);
  };

  const handleDownload = (document: DocumentItem) => {
    // Simulate download functionality
    alert(`Downloading ${document.name}...`);
    // In a real app, this would trigger an actual file download
  };

  const stats = getCompletionStats();

  return (
    <Layout isAdmin={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600">Manage your application documents and portfolio</p>
          </div>
          <Button variant="primary" onClick={() => setUploadModalOpen(true)}>
            <Upload size={16} className="mr-2" />
            Upload Documents
          </Button>
        </div>

        {/* Progress Overview */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Document Completion</h3>
            <span className="text-sm font-medium text-gray-600">
              {stats.verified} of {stats.required} required documents verified
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-600">{documents.length}</div>
              <div className="text-sm text-blue-700">Total Documents</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-600">
                {documents.filter(d => d.status === 'verified').length}
              </div>
              <div className="text-sm text-green-700">Verified</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="text-lg font-semibold text-yellow-600">
                {documents.filter(d => d.status === 'pending').length}
              </div>
              <div className="text-sm text-yellow-700">Pending</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-semibold text-red-600">
                {documents.filter(d => d.status === 'rejected').length}
              </div>
              <div className="text-sm text-red-700">Rejected</div>
            </div>
          </div>
        </Card>

        {/* Category Filters */}
        <Card>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Documents ({documents.length})
            </Button>
            {documentCategories.map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.key)}
              >
                {category.name} ({documents.filter(d => d.category === category.key).length})
              </Button>
            ))}
          </div>
        </Card>

        {/* Required Documents Checklist - NOW FUNCTIONAL */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents Checklist</h3>
          <div className="space-y-3">
            {[
              { name: 'Bank Statement (Last 3 months)', category: 'financial', id: 'bank-statement' },
              { name: 'Business Registration Certificate', category: 'legal', id: 'business-reg' },
              { name: 'Tax Return (Previous year)', category: 'financial', id: 'tax-return' },
              { name: 'Identity Verification Document', category: 'legal', id: 'identity-doc' },
              { name: 'Proof of Business Address', category: 'legal', id: 'address-proof' }
            ].map((docTemplate, index) => {
              // Check if this required document exists in uploaded documents
              const existingDoc = documents.find(doc => 
                doc.required && 
                doc.name.toLowerCase().includes(docTemplate.name.toLowerCase().split(' ')[0].toLowerCase())
              );
              const isCompleted = !!existingDoc && existingDoc.status === 'verified';
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`}>
                      {isCompleted && <CheckCircle size={12} className="text-white" />}
                    </div>
                    <div>
                      <span className={`text-sm ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                        {docTemplate.name}
                      </span>
                      {existingDoc && (
                        <div className="text-xs text-gray-500 mt-1">
                          Status: <span className={`font-medium ${
                            existingDoc.status === 'verified' ? 'text-green-600' :
                            existingDoc.status === 'pending' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {existingDoc.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!isCompleted && (
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRequiredDocUpload(docTemplate)}
                      >
                        Upload
                      </Button>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                        style={{ display: 'none' }}
                        id={`upload-${docTemplate.id}`}
                        onChange={(e) => handleRequiredDocFileChange(e, docTemplate)}
                      />
                    </div>
                  )}
                  
                  {existingDoc && existingDoc.status === 'rejected' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => openReplaceModal(existingDoc)}
                    >
                      Replace
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Documents List */}
        <div className="space-y-4">
          {filteredDocuments.map((document) => (
            <Card key={document.id} hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText size={20} className="text-gray-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900">{document.name}</h3>
                      {document.required && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{document.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Category: {documentCategories.find(c => c.key === document.category)?.name}</span>
                      <span>Size: {document.size}</span>
                      <span>Type: {document.type}</span>
                      <span>Uploaded: {new Date(document.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(document.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                      {document.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDocument(document)}
                    >
                      <Eye size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownload(document)}
                    >
                      <Download size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(document.id)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              {document.status === 'rejected' && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    <strong>Rejection Reason:</strong> Document quality is unclear. Please upload a higher resolution version.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => openReplaceModal(document)}
                  >
                    Replace Document
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <FileText size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-500 mb-4">
                {selectedCategory === 'all' 
                  ? 'Upload your first document to get started'
                  : `No documents in the ${documentCategories.find(c => c.key === selectedCategory)?.name} category`
                }
              </p>
              <Button variant="primary" onClick={() => setUploadModalOpen(true)}>
                <Upload size={16} className="mr-2" />
                Upload Documents
              </Button>
            </div>
          </Card>
        )}

        {/* Upload Modal */}
        <Modal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          title="Upload Documents"
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentCategories.map((category) => (
                  <div key={category.key} className="p-3 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload size={32} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Drag and drop your files here
              </h3>
              <p className="text-gray-600 mb-4">
                or click to browse your computer
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.zip,.doc,.docx"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" size="lg" className="cursor-pointer">
                  Choose Files
                </Button>
              </label>
              <p className="text-xs text-gray-500 mt-4">
                Supported formats: PDF, PNG, JPG, ZIP, DOC, DOCX (Max 10MB each)
              </p>
            </div>
          </div>
        </Modal>

        {/* Replace Document Modal */}
        <Modal
          isOpen={replaceModalOpen}
          onClose={() => {
            setReplaceModalOpen(false);
            setDocumentToReplace(null);
          }}
          title="Replace Document"
          size="lg"
        >
          <div className="space-y-6">
            {documentToReplace && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-medium text-yellow-900 mb-2">Replacing Document:</h3>
                <p className="text-sm text-yellow-800">{documentToReplace.name}</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Category: {documentCategories.find(c => c.key === documentToReplace.category)?.name}
                </p>
              </div>
            )}

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload size={32} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Drop your replacement file here
              </h3>
              <p className="text-gray-600 mb-4">
                or click to browse your computer
              </p>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.zip,.doc,.docx"
                onChange={(e) => handleReplaceDocument(e.target.files)}
                className="hidden"
                id="replace-file-upload"
              />
              <label htmlFor="replace-file-upload">
                <Button variant="outline" size="lg" className="cursor-pointer">
                  Choose Replacement File
                </Button>
              </label>
              <p className="text-xs text-gray-500 mt-4">
                Supported formats: PDF, PNG, JPG, ZIP, DOC, DOCX (Max 10MB each)
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle size={16} className="text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">Important Notes:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• The new file will replace the existing document completely</li>
                    <li>• The document status will be reset to "Pending" for re-verification</li>
                    <li>• Make sure the new file is clear and meets all requirements</li>
                    <li>• You can only upload one replacement file at a time</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {/* Document Details Modal */}
        <Modal
          isOpen={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
          title="Document Details"
          size="lg"
        >
          {selectedDocument && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-gray-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedDocument.name}</h2>
                  <p className="text-gray-600">{selectedDocument.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Document Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="text-gray-900">
                        {documentCategories.find(c => c.key === selectedDocument.category)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">File Type:</span>
                      <span className="text-gray-900">{selectedDocument.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">File Size:</span>
                      <span className="text-gray-900">{selectedDocument.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Upload Date:</span>
                      <span className="text-gray-900">
                        {new Date(selectedDocument.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Verification Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedDocument.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedDocument.status)}`}>
                        {selectedDocument.status}
                      </span>
                    </div>
                    {selectedDocument.required && (
                      <div className="mt-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Required Document
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <Button 
                  variant="primary" 
                  className="flex-1"
                  onClick={() => handleDownload(selectedDocument)}
                >
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    openReplaceModal(selectedDocument);
                  }}
                >
                  Replace
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    handleDelete(selectedDocument.id);
                    setSelectedDocument(null);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
}