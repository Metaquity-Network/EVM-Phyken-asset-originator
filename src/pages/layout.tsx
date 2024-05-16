'use client';

import Loader from '@/src/components/common/Loader';
import Header from '@/src/layout/admin-layout/Header';
import Sidebar from '@/src/layout/admin-layout/Sidebar';
import { useState, useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {loading ? (
        <Loader />
      ) : (
        <div className="flex h-screen overflow-hidden">
          {/* <!-- ===== Sidebar Start ===== --> */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="h-auto">
              <div className="mx-4 mt-5 p-4 md:p-6 2xl:p-10 bg-white h-full dark:bg-boxdark-2">{children}</div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
