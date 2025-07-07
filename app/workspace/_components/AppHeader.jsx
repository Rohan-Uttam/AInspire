import React from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";

function AppHeader({hideSidebar=false}) {
  return (
    <div className='p-4 flex items-center justify-between shadow-sm'>
      {!hideSidebar &&<SidebarTrigger />}
      <UserButton/>
    </div>
  );
}

export default AppHeader