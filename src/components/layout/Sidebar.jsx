import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Phone, Mic2, ChevronsUpDown, LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const navMain = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/calls', label: 'Call Log', icon: Phone },
];

export function AppSidebar(props) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="cursor-default select-none hover:bg-transparent active:bg-transparent">
              <div>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-(--green) text-white">
                  <Mic2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>RestoVoice</span>
                  <span className="truncate text-xs text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>AI Platform</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel style={{ fontFamily: 'Inter, sans-serif' }}>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navMain.map(({ to, label, icon: Icon }) => (
              <SidebarMenuItem key={to}>
                <NavLink to={to} end={to === '/'} className="w-full">
                  {({ isActive }) => (
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={label}>
                      <div className="flex items-center gap-2 cursor-pointer" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <Icon className={cn('shrink-0', isActive ? 'text-(--green)' : '')} />
                        <span>{label}</span>
                      </div>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="cursor-pointer">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-(--green) text-white text-xs font-bold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>R</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Admin</span>
                    <span className="truncate text-xs text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>Restaurant</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              {/* <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuItem className="cursor-pointer">
                  <LogOut className="mr-2 size-4" />
                  <span style={{ fontFamily: 'Inter, sans-serif' }}>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent> */}
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
