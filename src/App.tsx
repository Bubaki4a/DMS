import React, { useState } from 'react';
import { DmsProvider, useDms } from './context/DmsContext';
import { Navbar } from './components/Navbar';
import { CategorySidebar } from './components/CategorySidebar';
import { FilterBar } from './components/FilterBar';
import { DocumentGrid } from './components/DocumentGrid';
import { DocumentTable } from './components/DocumentTable';
import { DocumentDetailModal } from './components/DocumentDetailModal';
import { UploadDocumentModal } from './components/UploadDocumentModal';
import { ApprovalQueueView } from './components/ApprovalQueueView';
import { AuditLogView } from './components/AuditLogView';
import { AnalyticsReportsView } from './components/AnalyticsReportsView';
import { PermissionsMatrixView } from './components/PermissionsMatrixView';
import { ToastContainer } from './components/ToastContainer';
import { EducationalDocument } from './types';

const MainContent: React.FC = () => {
  const { activeTab, isUploadModalOpen, setIsUploadModalOpen, documents } = useDms();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const selectedDoc = selectedDocId ? documents.find((d) => d.id === selectedDocId) || null : null;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'documents' && (
          <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto shadow-xs border-x border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900">
            {/* Left Category Filter Sidebar */}
            <CategorySidebar />

            {/* Document Browser Area */}
            <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/60 min-w-0">
              <FilterBar viewMode={viewMode} setViewMode={setViewMode} />
              
              <div className="flex-1">
                {viewMode === 'grid' ? (
                  <DocumentGrid onOpenDoc={(doc) => setSelectedDocId(doc.id)} />
                ) : (
                  <DocumentTable onOpenDoc={(doc) => setSelectedDocId(doc.id)} />
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'approvals' && (
          <ApprovalQueueView onOpenDoc={(doc) => setSelectedDocId(doc.id)} />
        )}

        {activeTab === 'audit' && (
          <AuditLogView />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsReportsView />
        )}

        {activeTab === 'permissions' && (
          <PermissionsMatrixView />
        )}
      </main>

      {/* Detail & History Modal */}
      {selectedDoc && (
        <DocumentDetailModal
          doc={selectedDoc}
          onClose={() => setSelectedDocId(null)}
        />
      )}

      {/* Upload Wizard Modal */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {/* Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <DmsProvider>
      <MainContent />
    </DmsProvider>
  );
}
