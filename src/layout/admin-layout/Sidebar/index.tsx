'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  FaHome,
  FaDatabase,
  FaWallet,
  FaIdCardAlt,
  FaCog,
  FaSignOutAlt,
  FaQuestionCircle,
  FaArrowLeft,
  FaExchangeAlt,
} from 'react-icons/fa';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);
  const router = useRouter();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const storedSidebarExpanded = 'true';

  const sidebarMenu = [
    {
      name: 'Dashboard',
      icon: 'FaHome',
      pathname: '/',
    },
    ...(isConnected
      ? [
          {
            name: 'Licenses',
            icon: 'FaIdCardAlt',
            pathname: '/upload-license',
          },
          {
            name: 'My Assets',
            icon: 'FaDatabase',
            pathname: '/assets',
          },
          {
            name: 'Wallet',
            icon: 'FaWallet',
            pathname: '/wallet',
          },
          {
            name: 'Transactions',
            icon: 'FaExchangeAlt',
            pathname: '/transactions',
          },
        ]
      : []),
  ];

  interface IconComponents {
    [key: string]: React.ComponentType<any>;
  }

  const iconComponents: IconComponents = {
    FaHome,
    FaDatabase,
    FaWallet,
    FaIdCardAlt,
    FaCog,
    FaSignOutAlt,
    FaQuestionCircle,
    FaArrowLeft,
    FaExchangeAlt,
  };

  const FaIcon = ({ icon }: { icon: string }) => {
    const IconComponent = iconComponents[icon];

    if (!IconComponent) {
      return null; // Handle unknown icons or provide a default icon
    }

    return <IconComponent />;
  };

  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const logout = async () => {
    localStorage.clear();
    sessionStorage.clear();
    await disconnect();
    const res = await axios.post('/api/auth/logout');
    if (res.status === 200) {
      router.push('/login');
    }
  };

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-primary text-white duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 re">
        <Link href="/">
          <img width={45} height={32} src={'/images/logo/logo.png'} alt="Logo" />
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <FaArrowLeft />
        </button>
      </div>

      <div className="no-scrollbar overflow-y-auto duration-300 ease-linear">
        <nav className="flex flex-col justify-between h-screen mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              {sidebarMenu.map((menu, i) => {
                return (
                  <li key={i}>
                    <Link
                      href={menu.pathname}
                      className={`group relative flex items-center gap-2.5 px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark hover:rounded-full dark:hover:bg-primary ${
                        pathname === menu.pathname &&
                        'bg-white text-primary dark:bg-meta-4 dark:text-white rounded-full dark:hover:bg-primary'
                      }`}
                    >
                      <FaIcon icon={menu.icon} />
                      {menu.name}
                      {/* {menu.notification ? (
                        <span className="absolute right-4 block rounded-full bg-red py-1 px-2 text-xs font-medium text-white">
                          {menu.notification}
                        </span>
                      ) : null} */}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {isConnected ? (
            <div className="py-25">
              <ul className="mb-6 flex flex-col gap-1.5">
                <li>
                  <Link
                    href="/settings"
                    className={`group relative flex items-center gap-2.5 px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark hover:rounded-full dark:hover:bg-meta-4`}
                  >
                    <FaCog />
                    Settings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className={`group relative flex items-center gap-2.5 px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark hover:rounded-full dark:hover:bg-meta-4`}
                  >
                    <FaQuestionCircle />
                    Support
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className={`group relative flex items-center gap-2.5 px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark hover:rounded-full dark:hover:bg-meta-4`}
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : null}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
