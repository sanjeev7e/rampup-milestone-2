import { Divider } from "@mui/material";
import { logos } from "../../constants/static/images";

export default function RootLayout({
  children,
  header,
  sidebar,
}: {
  children?: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
}) {
  return (
    <div className='flex h-screen'>
      {sidebar && (
        <aside className='bg-surface-variant overflow-auto px-6 py-6 flex flex-col gap-10'>
          <img src={logos.app_logo_main} alt='app logo' />
          <Divider className='bg-outline' />
          <div className='flex-1'>{sidebar}</div>
        </aside>
      )}
      <div className='flex-1 flex flex-col h-full'>
        {header && <header className='bg-surface'>{header}</header>}
        <main className='flex-1 bg-background overflow-auto'>{children}</main>
      </div>
    </div>
  );
}
