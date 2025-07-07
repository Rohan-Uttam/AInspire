"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link"; // ✅ Fix: Import Link component from next/link
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import AddNewCourseDialog from "./AddNewCourseDialog"; // ✅ Fix: Ensure correct import path for AddNewCourseDialog

import {
  Book,
  LayoutDashboard,
  Compass, // ✅ Fix: Add Compass icon import
  PencilRulerIcon,
  UserCircle2Icon,
  WalletCards,
} from "lucide-react";
import { usePathname } from "next/navigation";

// ✅ Fix: Corrected variable name (was `constSideBaeOptions`)
const SidebarOptions = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/workspace",
  },
  {
    title: "My Learning",
    icon: Book,
    path: "/workspace/my-learning",
  },
  {
    title: "Explore Courses",
    icon: Compass,
    path: "/workspace/explore",
  },
  {
    title: "Billing",
    icon: WalletCards,
    path: "/workspace/billing",
  },
  {
    title: "Profile",
    icon: UserCircle2Icon,
    path: "/workspace/profile",
  },
];

function AppSidebar() {
     const path = usePathname();


  return (
    <Sidebar>
      <SidebarHeader className="p-2">
        <Image src="/logo.svg" alt="Company Logo" width={130} height={120} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <AddNewCourseDialog>
            <Button>Create New Course</Button>
          </AddNewCourseDialog>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {SidebarOptions.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild className={"p-5"}>
                    <Link
                      href={item.path}
                      className={`text-[17px]
                        ${
                          path.includes(item.path) && "text-primary bg-purple"
                        }`}
                    >
                      <item.icon className="h-7 w-7" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
