import { LayoutDashboard, Calendar, Search, FileText, Settings, Users, UserRound, Clock } from 'lucide-react';

export const PATIENT_MENU = [
  { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { path: '/search-doctors', label: 'Book Appointment', icon: Search },
  { path: '/medical-history', label: 'Medical History', icon: FileText },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const DOCTOR_MENU = [
  { path: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/doctor/schedule', label: 'Schedule', icon: Calendar },
  { path: '/doctor/records', label: 'Records', icon: FileText },
  { path: '/doctor/settings', label: 'Settings', icon: Settings },
];
