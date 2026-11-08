import {
  AuthIcon,
  HomeIcon,
  InvoiceIcon,
  PieChartIcon,
  ServerIcon,
  TableIcon,
  TaskIcon,
  UserGroupIcon,
  UserIcon,
  Widget4Icon,
  WindowIcon,
} from "./icon";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: <HomeIcon />,
        items: [],
      },
      {
        title: "VPN Control",
        icon: <WindowIcon />,
        items: [
          {
            title: "Services",
            url: "/vpn/services",
          },
          {
            title: "L2TP Users",
            url: "/vpn/l2tp-users",
          },
          {
            title: "WireGuard Peers",
            url: "/vpn/wireguard-peers",
          },
          {
            title: "Port Forwards",
            url: "/vpn/port-forwards",
          },
        ],
      },
      {
        title: "Daily Tasks",
        url: "/daily-tasks",
        icon: <TaskIcon />,
        items: [],
      },
    ],
  },
  {
    label: "INFRASTRUCTURE",
    items: [
      {
        title: "POP",
        url: "/pop",
        icon: <Widget4Icon />,
        items: [],
      },
      {
        title: "OTB",
        url: "/otb",
        icon: <TableIcon />,
        items: [],
      },
      {
        title: "Cores",
        url: "/cores",
        icon: <PieChartIcon />,
        items: [],
      },
      {
        title: "Clients",
        url: "/clients",
        icon: <UserGroupIcon />,
        items: [],
      },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      {
        title: "Servers",
        url: "/servers",
        icon: <ServerIcon />,
        items: [],
      },
      {
        title: "Users",
        url: "/users",
        icon: <UserIcon />,
        items: [],
      },
      {
        title: "Settings",
        url: "/settings",
        icon: <AuthIcon />,
        items: [],
      },
      {
        title: "Audit Logs",
        url: "/audit-logs",
        icon: <InvoiceIcon />,
        items: [],
      },
    ],
  },
];
