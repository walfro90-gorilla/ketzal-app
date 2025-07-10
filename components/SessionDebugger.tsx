'use client'

import { useSession } from 'next-auth/react';
import { useSessionReady } from '@/hooks/useSessionReady';
import { useAuthDetection } from '@/hooks/useAuthDetection';

const SessionDebugger = () => {
  const rawSession = useSession();
  const readySession = useSessionReady();
  const authDetection = useAuthDetection();

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-md overflow-auto z-50">
      <h3 className="font-bold mb-2">🔍 Session Debug</h3>
      
      <div className="mb-2">
        <strong>Raw useSession:</strong>
        <div>Status: {rawSession.status}</div>
        <div>User ID: {rawSession.data?.user?.id || 'none'}</div>
        <div>User Email: {rawSession.data?.user?.email || 'none'}</div>
      </div>
      
      <div className="mb-2">
        <strong>useSessionReady:</strong>
        <div>Status: {readySession.status}</div>
        <div>IsReady: {readySession.isReady ? 'Yes' : 'No'}</div>
        <div>IsAuth: {readySession.isAuthenticated ? 'Yes' : 'No'}</div>
        <div>IsLoading: {readySession.isLoading ? 'Yes' : 'No'}</div>
        <div>JustLoggedIn: {readySession.justLoggedIn ? 'Yes' : 'No'}</div>
        <div>User ID: {readySession.session?.user?.id || 'none'}</div>
      </div>
      
      <div className="mb-2">
        <strong>useAuthDetection:</strong>
        <div>IsAuth: {authDetection.isAuthenticated ? 'Yes' : 'No'}</div>
        <div>IsLoading: {authDetection.isLoading ? 'Yes' : 'No'}</div>
        <div>Method: {authDetection.detectionMethod}</div>
        <div>User ID: {authDetection.userId || 'none'}</div>
      </div>
    </div>
  );
};

export default SessionDebugger;
