import {
  Avatar,
  Badge,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import RootLayout from "./RootLayout";
import { icons } from "../../constants/static/images";
import AppButton from "../ui/AppButton";

const menuItems = [
  { label: "Dashboard", icon: icons.dashboard },
  { label: "Orders", icon: icons.orders },
  { label: "Products", icon: icons.products },
  { label: "Vendors", icon: icons.vendors },
  { label: "Setting", icon: icons.settings },
  { label: "Logout", icon: icons.logout },
];

export default function AdminLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <RootLayout header={<Header />} sidebar={<Sidebar />}>
      {children}
    </RootLayout>
  );
}

function Header() {
  return (
    <div className='flex justify-between items-center px-5 py-3'>
      <h1 className='text-sm font-normal text-primary'>Products List</h1>
      <AppButton type='icon-button' size='small'>
        <Badge variant='dot' color='primary'>
          <img src={icons.notifications} alt='notifications' className='h-6' />
        </Badge>
      </AppButton>
    </div>
  );
}

function Sidebar() {
  return (
    <div className='flex flex-col justify-between h-full'>
      <List className='h-full'>
        {menuItems.slice(0, 4).map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <img src={item.icon} alt={item.label} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                className='text-inverse-on-surface-variant text-sm'
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List>
        {menuItems.slice(4).map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <img src={item.icon} alt={item.label} />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <div className='flex items-center gap-2 mt-4'>
        <Avatar className='p-4 text-xs! h-5! w-5!'>WW</Avatar>
        <h5 className='text-sm font-semibold text-text-color'>Wade Waren</h5>
      </div>
    </div>
  );
}
