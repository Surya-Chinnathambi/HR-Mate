import React, { useEffect, useState, useRef } from "react";
import { NavLink, BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Home,
  User2,
  Clock4,
  CalendarRange,
  BarChart3,
  Wallet,
  Plane,
  LifeBuoy,
  AppWindow,
  Inbox,
  Bell,
  Archive,
  Users,
  CalendarDays,
  Handshake,
  IndianRupee,
  FileText,
  Building2,
  Network,
  Megaphone,
  MessageSquareQuote,
  ThumbsUp,
  Target,
  MessageSquare,
  ClipboardCheck,
  LogOut,
  Palette,
  Moon,
  Sun,
  ChevronDown,
  Menu,
  Sparkles,
} from "lucide-react";

// Import existing modules
import { EnhancedDashboard } from "./EnhancedDashboard";
import { AttendanceModule } from "./AttendanceModule";
import { LeaveModule } from "./LeaveModule";
import { PayrollModule } from "./PayrollModule";
import { ProfileModule } from "./ProfileModule";
import { MyTeamModule } from "./MyTeamModule";
import { PerformanceModule } from "./PerformanceModule";
import { ExpensesModule } from "./ExpensesModule";
import { MyFinancesModule } from "./MyFinancesModule";
import { HelpdeskModule } from "./HelpdeskModule";
import { AppsModule } from "./AppsModule";
import { EngageModule } from "./EngageModule";
import { OrganizationTreeModule } from "./OrganizationTreeModule";
import { OrganizationDirectory } from "./OrganizationDirectory";
import { EnhancedInbox } from "./EnhancedInbox";
import { AICommandCenter } from "./AICommandCenter";
import { CompanyPoliciesModule } from "./CompanyPoliciesModule";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { ThemePickerModal } from "./ThemePickerModal";

// Utility type for menu definitions
interface SubItem {
  id: string;
  label: string;
  to: string;
  icon?: React.ReactNode;
  component?: React.ComponentType<any>;
}

interface MainItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  to?: string;
  component?: React.ComponentType<any>;
  items?: SubItem[];
}

// Accent color handling via CSS variables
const ACCENTS = {
  indigo: "#6366f1",
  emerald: "#10b981",
  rose: "#f43f5e",
  amber: "#f59e0b",
  sky: "#0ea5e9",
};

function useDarkMode(initial = false) {
  const [dark, setDark] = useState(initial);
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);
  return { dark, setDark };
}

function classNames(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

// Menu structure with your existing components
const MENU: MainItem[] = [
    { id: "home", label: "Home", icon: <Home size={20} />, to: "/", component: EnhancedDashboard },
    {
      id: "me",
      label: "Me",
      icon: <User2 size={20} />,
      items: [
        { id: "attendance", label: "Attendance", to: "/me/attendance", icon: <Clock4 size={18} />, component: AttendanceModule },
        { id: "leave", label: "Leave", to: "/me/leave", icon: <CalendarRange size={18} />, component: LeaveModule },
        { id: "performance", label: "Performance", to: "/me/performance", icon: <BarChart3 size={18} />, component: PerformanceModule },
        { id: "expenses", label: "Expenses & Travel", to: "/me/expenses", icon: <Plane size={18} />, component: ExpensesModule },
        { id: "helpdesk", label: "Helpdesk", to: "/me/helpdesk", icon: <LifeBuoy size={18} />, component: HelpdeskModule },
        { id: "apps", label: "Apps", to: "/me/apps", icon: <AppWindow size={18} />, component: AppsModule },
      ],
    },
    {
      id: "inbox",
      label: "Inbox",
      icon: <Inbox size={20} />,
      items: [
        { id: "take-action", label: "Take Action", to: "/inbox/actions", icon: <ClipboardCheck size={18} />, component: EnhancedInbox },
        { id: "notifications", label: "Notifications", to: "/inbox/notifications", icon: <Bell size={18} />, component: EnhancedInbox },
        { id: "archive", label: "Archive", to: "/inbox/archive", icon: <Archive size={18} />, component: EnhancedInbox },
      ],
    },
    {
      id: "team",
      label: "My Team",
      icon: <Users size={20} />,
      items: [
        { id: "summary", label: "Summary", to: "/team/summary", icon: <Users size={18} />, component: MyTeamModule },
        { id: "team-calendar", label: "Team Calendar", to: "/team/calendar", icon: <CalendarDays size={18} />, component: MyTeamModule },
        { id: "peers", label: "Peers", to: "/team/peers", icon: <Handshake size={18} />, component: MyTeamModule },
      ],
    },
    {
      id: "finances",
      label: "My Finances",
      icon: <IndianRupee size={20} />,
      items: [
        { id: "payroll", label: "Payroll", to: "/finances/payroll", icon: <Wallet size={18} />, component: PayrollModule },
        { id: "tax-docs", label: "Tax Docs", to: "/finances/tax-docs", icon: <FileText size={18} />, component: MyFinancesModule },
      ],
    },
    {
      id: "org",
      label: "Org",
      icon: <Building2 size={20} />,
      items: [
        { id: "directory", label: "Employee Directory", to: "/org/directory", icon: <MessageSquare size={18} />, component: OrganizationDirectory },
        { id: "org-tree", label: "Organization Tree", to: "/org/tree", icon: <Network size={18} />, component: OrganizationTreeModule },
      ],
    },
    {
      id: "engage",
      label: "Engage",
      icon: <Megaphone size={20} />,
      items: [
        { id: "posts", label: "Posts", to: "/engage/posts", icon: <MessageSquareQuote size={18} />, component: EngageModule },
        { id: "polls", label: "Polls", to: "/engage/polls", icon: <BarChart3 size={18} />, component: EngageModule },
        { id: "praise", label: "Praise", to: "/engage/praise", icon: <ThumbsUp size={18} />, component: EngageModule },
      ],
    },
    {
      id: "performance-main",
      label: "Performance",
      icon: <Target size={20} />,
      items: [
        { id: "my-goals", label: "My Goals", to: "/performance/goals", icon: <Target size={18} />, component: PerformanceModule },
        { id: "feedback", label: "Feedback", to: "/performance/feedback", icon: <MessageSquare size={18} />, component: PerformanceModule },
        { id: "reviews", label: "Reviews", to: "/performance/reviews", icon: <BarChart3 size={18} />, component: PerformanceModule },
      ],
    },
];

const ComponentWrapper: React.FC<{ 
  Component: React.ComponentType<any>; 
  employee: any;
  title: string;
}> = ({ Component, employee, title }) => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
    </div>
    <Component employee={employee} />
  </div>
);

const SidebarSection: React.FC<{
  item: MainItem;
  collapsed: boolean;
}> = ({ item, collapsed }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isLinkOnly = !!item.to;
  const hasSubmenu = !!item.items;

  const content = (
    <>
      <span className="shrink-0 opacity-90">{item.icon}</span>
      {!collapsed && <span className="font-medium">{item.label}</span>}
    </>
  );

  const commonClasses = "group flex items-center gap-4 w-full rounded-xl px-4 py-3 text-sm transition-all duration-200";
  const activeClasses = "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg";
  const inactiveClasses = "text-gray-300 hover:bg-gray-800 hover:text-white";

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isLinkOnly ? (
        <NavLink
          to={item.to!}
          end
          className={({ isActive }) => classNames(commonClasses, isActive ? activeClasses : inactiveClasses)}
          title={item.label}
        >
          {content}
        </NavLink>
      ) : (
        <div className={classNames(commonClasses, inactiveClasses, "cursor-pointer")} title={item.label}>
          {content}
        </div>
      )}

      <AnimatePresence>
        {isHovered && hasSubmenu && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-0 z-50 w-60 rounded-xl border border-gray-700 bg-gray-800/95 backdrop-blur-sm p-2 shadow-2xl"
            style={{ left: "calc(100% + 12px)" }}
          >
            <div className="mb-2 px-3 py-1 text-sm font-semibold text-white">{item.label}</div>
            <div className="space-y-1">
              {item.items!.map((sub) => (
                <NavLink
                  key={sub.id}
                  to={sub.to}
                  className={({ isActive }) =>
                    classNames(
                      "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                      "text-gray-400 hover:text-white hover:bg-gray-700/70",
                      isActive && "text-white bg-gray-700"
                    )
                  }
                >
                  <span className="opacity-90">{sub.icon}</span>
                  <span>{sub.label}</span>
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UserMenu: React.FC<{
  employee: any;
  onViewProfile: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
  dark: boolean;
  setDark: (v: boolean) => void;
  accent: keyof typeof ACCENTS;
  setAccent: (k: keyof typeof ACCENTS) => void;
}> = ({ employee, onViewProfile, onChangePassword, onLogout, dark, setDark, accent, setAccent }) => {
  const [open, setOpen] = useState(false);
  
  const displayName = employee ? `${employee.firstName} ${employee.lastName}` : "User";
  const initials = employee ? `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}` : "U";
  const imageUrl = employee?.imageUrl;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 rounded-xl pl-2 pr-3 py-2 bg-gray-800 text-gray-200 hover:bg-gray-700 transition-all duration-200"
      >
        {imageUrl ? (
          <img src={imageUrl} alt={displayName} className="w-8 h-8 rounded-lg object-cover" />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {initials}
          </div>
        )}
        <span className="hidden md:inline-block text-sm font-medium">{displayName}</span>
        <ChevronDown size={16} className="opacity-70" />
      </button>
      
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-700 bg-gray-800 text-gray-200 shadow-xl z-50"
          >
            <div className="px-4 py-3 border-b border-gray-700">
              <div className="flex items-center gap-3">
                {imageUrl ? (
                  <img src={imageUrl} alt={displayName} className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {initials}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-white">{displayName}</p>
                  <p className="text-sm text-gray-400">{employee?.designation || "Employee"}</p>
                </div>
              </div>
            </div>
            <div className="py-2">
              <button onClick={() => { setOpen(false); onViewProfile(); }} className="flex w-full items-center gap-3 px-4 py-2 hover:bg-gray-700 text-sm transition-colors">
                <User2 size={16} /> View Profile
              </button>
              <button onClick={() => { setOpen(false); onChangePassword(); }} className="flex w-full items-center gap-3 px-4 py-2 hover:bg-gray-700 text-sm transition-colors">
                <ClipboardCheck size={16} /> Change Password
              </button>
              <div className="my-2 border-t border-gray-700" />
              <div className="px-4 py-2 text-xs uppercase tracking-wide text-gray-400">Theme</div>
              <div className="flex items-center justify-between px-4 pb-2">
                <div className="flex items-center gap-2 text-sm">
                  <button onClick={() => setDark(false)} className={classNames("flex items-center gap-1 rounded px-2 py-1 hover:bg-gray-700 transition-colors", !dark && "bg-gray-700")}>
                    <Sun size={14} /> Light
                  </button>
                  <button onClick={() => setDark(true)} className={classNames("flex items-center gap-1 rounded px-2 py-1 hover:bg-gray-700 transition-colors", dark && "bg-gray-700")}>
                    <Moon size={14} /> Dark
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Palette size={14} className="opacity-70" />
                  <div className="flex gap-1">
                    {Object.entries(ACCENTS).map(([k, v]) => (
                      <button
                        key={k}
                        aria-label={`Set accent ${k}`}
                        onClick={() => setAccent(k as keyof typeof ACCENTS)}
                        className={classNames("w-4 h-4 rounded-full border border-gray-700 transition-all", (k as keyof typeof ACCENTS) === accent && "ring-2 ring-offset-2 ring-offset-gray-800 ring-[var(--accent-color)]")}
                        style={{ backgroundColor: v }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="my-2 border-t border-gray-700" />
              <button onClick={() => { setOpen(false); onLogout(); }} className="flex w-full items-center gap-3 px-4 py-2 hover:bg-gray-700 text-sm text-red-300 transition-colors">
                <LogOut size={16} /> Logout
              </button>
            </div>
            {employee && (
              <div className="px-4 py-2 border-t border-gray-700">
                <p className="text-xs text-gray-500 text-center">
                  Employee ID: {employee.employeeId}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function KekaStyleNavigation() {
  const [collapsed, setCollapsed] = useState(false);
  const { dark, setDark } = useDarkMode(false);
  const [accent, setAccent] = useState<keyof typeof ACCENTS>("indigo");
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);

  const employee = useQuery(api.employees.getCurrentEmployee);
  const notifications = useQuery(api.realtime.getNotifications);
  const createEmployee = useMutation(api.employeeSetup.createCurrentEmployee);
  const initializeSampleData = useMutation(api.sampleData.initializeSampleData);

  useEffect(() => {
    if (employee === null) {
      createEmployee().then(() => {
        initializeSampleData().catch(console.error);
      }).catch(console.error);
    }
  }, [employee, createEmployee, initializeSampleData]);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", ACCENTS[accent]);
  }, [accent]);

  const width = collapsed ? 80 : 280;

  const sidebarClass = classNames(
    "fixed left-0 top-0 h-screen bg-gray-900 text-gray-300 border-r border-gray-800 z-40",
    "flex flex-col transition-all duration-300"
  );

  if (!employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Setting up your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <header className="fixed left-0 right-0 top-0 z-30 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
          <div className="flex items-center justify-between px-6 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCollapsed((c) => !c)}
                className="rounded-lg p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Menu size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl shadow-lg flex items-center justify-center"
                  style={{ background: `linear-gradient(45deg, var(--accent-color), #6366f1)` }}
                >
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">HRMS Pro</h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAIOpen(true)}
                className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2.5 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Sparkles size={20} />
              </button>
              <button className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Bell size={18} className="text-gray-600 dark:text-gray-300" />
                {notifications?.unreadCount && notifications.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {notifications.unreadCount > 9 ? '9+' : notifications.unreadCount}
                  </span>
                )}
              </button>
              <UserMenu
                employee={employee}
                onViewProfile={() => window.location.href = "/profile"}
                onChangePassword={() => setIsChangePasswordOpen(true)}
                onLogout={() => console.log("Logout clicked")}
                dark={dark}
                setDark={setDark}
                accent={accent}
                setAccent={setAccent}
              />
            </div>
          </div>
        </header>

        <motion.aside
          className={sidebarClass}
          animate={{ width }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ top: 64 }}
        >
          <nav className="px-4 py-6 space-y-2 overflow-y-auto flex-1">
            {MENU.map((m) => (
              <SidebarSection
                key={m.id}
                item={m}
                collapsed={collapsed}
              />
            ))}
          </nav>
          <div className="p-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 text-center">
              © {new Date().getFullYear()} HRMS Pro
            </div>
          </div>
        </motion.aside>

        <main
          className="pt-16 transition-all duration-300 min-h-screen"
          style={{ marginLeft: width }}
        >
          <div className="min-h-[calc(100vh-64px)] bg-white dark:bg-gray-900">
            <Routes>
              <Route path="/" element={<ComponentWrapper Component={EnhancedDashboard} employee={employee} title="Dashboard" />} />
              <Route path="/profile" element={<ComponentWrapper Component={ProfileModule} employee={employee} title="Profile" />} />
              <Route path="/me/attendance" element={<ComponentWrapper Component={AttendanceModule} employee={employee} title="Attendance" />} />
              <Route path="/me/leave" element={<ComponentWrapper Component={LeaveModule} employee={employee} title="Leave Management" />} />
              <Route path="/me/performance" element={<ComponentWrapper Component={PerformanceModule} employee={employee} title="My Performance" />} />
              <Route path="/me/expenses" element={<ComponentWrapper Component={ExpensesModule} employee={employee} title="Expenses & Travel" />} />
              <Route path="/me/helpdesk" element={<ComponentWrapper Component={HelpdeskModule} employee={employee} title="Helpdesk" />} />
              <Route path="/me/apps" element={<ComponentWrapper Component={AppsModule} employee={employee} title="Apps" />} />
              <Route path="/inbox/actions" element={<ComponentWrapper Component={EnhancedInbox} employee={employee} title="Take Action" />} />
              <Route path="/inbox/notifications" element={<ComponentWrapper Component={EnhancedInbox} employee={employee} title="Notifications" />} />
              <Route path="/inbox/archive" element={<ComponentWrapper Component={EnhancedInbox} employee={employee} title="Archive" />} />
              <Route path="/team/summary" element={<ComponentWrapper Component={MyTeamModule} employee={employee} title="Team Summary" />} />
              <Route path="/team/calendar" element={<ComponentWrapper Component={MyTeamModule} employee={employee} title="Team Calendar" />} />
              <Route path="/team/peers" element={<ComponentWrapper Component={MyTeamModule} employee={employee} title="Peers" />} />
              <Route path="/finances/payroll" element={<ComponentWrapper Component={PayrollModule} employee={employee} title="Payroll" />} />
              <Route path="/finances/tax-docs" element={<ComponentWrapper Component={MyFinancesModule} employee={employee} title="Tax Documents" />} />
              <Route path="/org/directory" element={<ComponentWrapper Component={OrganizationDirectory} employee={employee} title="Employee Directory" />} />
              <Route path="/org/tree" element={<ComponentWrapper Component={OrganizationTreeModule} employee={employee} title="Organization Tree" />} />
              <Route path="/engage/posts" element={<ComponentWrapper Component={EngageModule} employee={employee} title="Posts" />} />
              <Route path="/engage/polls" element={<ComponentWrapper Component={EngageModule} employee={employee} title="Polls" />} />
              <Route path="/engage/praise" element={<ComponentWrapper Component={EngageModule} employee={employee} title="Praise" />} />
              <Route path="/performance/goals" element={<ComponentWrapper Component={PerformanceModule} employee={employee} title="My Goals" />} />
              <Route path="/performance/feedback" element={<ComponentWrapper Component={PerformanceModule} employee={employee} title="Feedback" />} />
              <Route path="/performance/reviews" element={<ComponentWrapper Component={PerformanceModule} employee={employee} title="Reviews" />} />
            </Routes>
          </div>
        </main>

        {isAIOpen && employee && (
          <AICommandCenter 
            onClose={() => setIsAIOpen(false)} 
            employee={employee} 
          />
        )}
        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
          onSubmit={async (currentPassword: string, newPassword: string) => {
            console.log("Password change:", { currentPassword, newPassword });
          }}
        />
        <ThemePickerModal
          isOpen={isThemePickerOpen}
          onClose={() => setIsThemePickerOpen(false)}
          currentTheme={accent}
          onThemeChange={(theme) => setAccent(theme as keyof typeof ACCENTS)}
        />
      </div>
    </BrowserRouter>
  );
}
