"use client"

import { Home, Settings, UserRound, MapPinHouse } from "lucide-react"
import {
  Sidebar,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"


// Menu items.
const items = [
  {
    title: "Início",
    url: "/",
    icon: Home,
  },
  {
    title: "Usuário",
    url: "/profile",
    icon: UserRound,
  },
  {
    title: "Locais Seguros",
    url: "/safetyPlace",
    icon: MapPinHouse,
  },
]
 
export function AppSidebar() {
  const { open } = useSidebar()
  return (
    <div
      className={`transition-all duration-300 ${
        open ? "w-55" : "w-10"
      } min-h-screen`}
    >
      <Sidebar collapsible="icon">
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                      <a href={item.url} className="flex ml-1 gap-2.5 py-2">
                        <item.icon className="text-white rounded" size={20}/>
                          {open && (
                          <span
                            className="text-white rounded px-2 -translate-y-1 inline-block"
                          >
                            {item.title}
                          </span>
                          )}
                      </a>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </Sidebar>
    </div>
  )
}
