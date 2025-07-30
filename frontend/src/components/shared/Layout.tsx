import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Chatbot } from './Chatbot';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin: boolean;
}

export function Layout({ children, isAdmin }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAdmin={isAdmin} />
      <div className="flex">
        <Sidebar isAdmin={isAdmin} />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
      <Chatbot />
    </div>
  );
}