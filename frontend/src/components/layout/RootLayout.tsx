import { Divider } from "@mui/material";
import { logos } from "../../constants/static/images";
import { useNavigate } from "react-router-dom";

export default function RootLayout({
  children,
  header,
  sidebar,
}: {
  children?: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <div className='flex h-screen overflow-hidden'>
      {sidebar && (
        <aside className='bg-surface-variant overflow-auto px-6 py-6 flex flex-col gap-10 min-w-[200px]'>
          <img
            src={logos.app_logo_main}
            alt='app logo'
            className='cursor-pointer'
            onClick={() => navigate("/")}
          />
          <Divider className='bg-outline' />
          <div className='flex-1'>{sidebar}</div>
        </aside>
      )}
      <div className='flex-1 flex flex-col h-full overflow-auto'>
        {header && <header className='bg-surface'>{header}</header>}
        <main className='flex flex-1 bg-background overflow-auto m-5'>
          {children}
        </main>
      </div>
    </div>
  );
}
