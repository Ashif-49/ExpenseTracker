import React from "react";

function Svg({ children, size = 18, className = "", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function MenuIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </Svg>
  );
}

export function ChevronLeftIcon(props) {
  return (
    <Svg {...props}>
      <path d="m15 18-6-6 6-6" />
    </Svg>
  );
}

export function ChevronRightIcon(props) {
  return (
    <Svg {...props}>
      <path d="m9 18 6-6-6-6" />
    </Svg>
  );
}

export function DashboardIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="4" rx="1.5" />
      <rect x="14" y="10" width="7" height="11" rx="1.5" />
      <rect x="3" y="13" width="7" height="8" rx="1.5" />
    </Svg>
  );
}

export function TransactionIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 7h10" />
      <path d="m14 4 3 3-3 3" />
      <path d="M17 17H7" />
      <path d="m10 20-3-3 3-3" />
    </Svg>
  );
}

export function ReportsIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 20V6" />
      <path d="M10 20V10" />
      <path d="M16 20V4" />
      <path d="M22 20V13" />
      <path d="M2 20h20" />
    </Svg>
  );
}

export function BudgetIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 7a3 3 0 0 1 3-3h12a3 3 0 0 1 0 6H6a3 3 0 0 1-3-3Z" />
      <path d="M4 10h14a3 3 0 0 1 0 6H6a3 3 0 0 0 0 6h12" />
      <circle cx="16" cy="16" r="1.25" />
    </Svg>
  );
}

export function ProfileIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </Svg>
  );
}

export function SettingsIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1.7 1.7 0 0 1 0 2.4 1.7 1.7 0 0 1-2.4 0l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a1.7 1.7 0 0 1-1.7 1.7h-3.6A1.7 1.7 0 0 1 8.5 20v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1.7 1.7 0 0 1-2.4 0 1.7 1.7 0 0 1 0-2.4l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H3.5A1.7 1.7 0 0 1 1.8 13.3V9.7A1.7 1.7 0 0 1 3.5 8h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1.7 1.7 0 0 1 0-2.4 1.7 1.7 0 0 1 2.4 0l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V3.5A1.7 1.7 0 0 1 10.2 1.8h3.6a1.7 1.7 0 0 1 1.7 1.7v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1.7 1.7 0 0 1 2.4 0 1.7 1.7 0 0 1 0 2.4l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6h.2a1.7 1.7 0 0 1 1.7 1.7v3.6a1.7 1.7 0 0 1-1.7 1.7h-.2a1 1 0 0 0-.9.6Z" />
    </Svg>
  );
}

export function LogoutIcon(props) {
  return (
    <Svg {...props}>
      <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
      <path d="M14 16l4-4-4-4" />
      <path d="M18 12H9" />
    </Svg>
  );
}

export function SearchIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Svg>
  );
}

export function BellIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6.5 8a5.5 5.5 0 0 1 11 0v4l1.5 2v1h-14v-1l1.5-2V8Z" />
      <path d="M10 18a2 2 0 1 0 4 0" />
    </Svg>
  );
}

export function MailIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </Svg>
  );
}

export function LockIcon(props) {
  return (
    <Svg {...props}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </Svg>
  );
}

export function EyeIcon(props) {
  return (
    <Svg {...props}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </Svg>
  );
}

export function EyeOffIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 3 21 21" />
      <path d="M10.6 6.3A11.9 11.9 0 0 1 12 6c6.5 0 10 6 10 6a15.1 15.1 0 0 1-4.1 4.5" />
      <path d="M6.1 6.8A15 15 0 0 0 2 12s3.5 6 10 6a11.5 11.5 0 0 0 5.3-1.3" />
      <path d="M9.9 9.9A3 3 0 0 0 12 15a3 3 0 0 0 2.1-.9" />
    </Svg>
  );
}

export function SparkleIcon(props) {
  return (
    <Svg {...props}>
      <path d="m12 2 1.4 3.6L17 7l-3.6 1.4L12 12l-1.4-3.6L7 7l3.6-1.4L12 2Z" />
      <path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14Z" />
      <path d="m19 13 .7 1.8L21.5 16l-1.8.7L19 18.5l-.7-1.8-1.8-.7 1.8-.7L19 13Z" />
    </Svg>
  );
}
