import { FileBox, PackageSearch, Combine, PackagePlus, Shield } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { DAPP_NAME } from "@/constants"
import { WalletConnector } from "@concordium/react-components"

const items = [
  {
    title: "Explorer",
    url: "/",
    icon: PackageSearch,
  },
  {
    title: "New Item",
    url: "/item/create",
    icon: PackagePlus,
  },
  {
    title: "Update Item",
    url: "/item/update",
    icon: FileBox,
  },
  {
    title: "Roles",
    url: "/roles/change",
    icon: Shield,
  },
  {
    title: "Transition Rules",
    url: "/transition-rules/add",
    icon: Combine,
  },
]

interface Props {
  connect: () => void;
  disconnect: () => void;
  account?: string;
  activeConnector?: WalletConnector;
}
export function AppSidebar({ connect, disconnect, account, activeConnector}: Props) {
  return (
    <Sidebar>
      <SidebarHeader>
      <h1 className="text-lg font-bold">{DAPP_NAME}</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {account
            ? (
              <div className="flex items-center justify-between">
                <p>{account.slice(0, 5) + '...' + account.slice(-5)}</p>
                <Button onClick={disconnect}>Disconnect</Button>
              </div>
            )
            : activeConnector
              ? <Button
              id="account"
              disabled={activeConnector && !account ? false : true}
              onClick={connect}
          >
            Connect Wallet
          </Button>
              : 'Loading...'
          }
      </SidebarFooter>
    </Sidebar>
  )
}
