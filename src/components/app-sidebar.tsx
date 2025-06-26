"use client"
import { usePathname } from "next/navigation"
import { Home, UserRound, MapPinHouse } from "lucide-react"
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
  const pathname = usePathname()
  return (
    <div
      className={`transition-all duration-300 ${ open ? "w-55" : "w-10" } min-h-screen`}>
      <Sidebar collapsible="icon">
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => {
              const isActive = pathname === item.url

              return (
                <SidebarMenuItem key={item.title}>
                  <a href={item.url} className="flex items-center ml-0.5 gap-2.5 py-2">
                    <div className={`p-1 rounded-full transition-all ${isActive ? "bg-white/20" : ""}`}>
                      <item.icon className="flex items-center text-white" size={20} />
                    </div>
                    {open && (
                      <span className="text-white rounded px-2 -translate-y-1 inline-block">
                        {item.title}
                      </span>
                    )}
                  </a>
                </SidebarMenuItem>
              )
              
            })}
          </SidebarMenu>
        </SidebarGroup>
      </Sidebar>
    </div>
  )
}
