import React, { PropsWithChildren, useState } from 'react';
import Head from 'next/head';
import Sidebar from '@/src/layout/admin-layout/Sidebar';
import Header from '@/src/layout/admin-layout/Header';

export default function AdminLayout({ children }: PropsWithChildren) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Head>
        <title> Metaquity network </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="assets/login/metaquity-logo.png" />
      </Head>

      <div className="dark:bg-boxdark-2 dark:text-bodydark">
        <div className="flex h-screen overflow-hidden">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="h-auto">
              <div className="mx-4 mt-5 p-4 md:p-6 2xl:p-10 bg-white h-full dark:bg-boxdark-2">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
