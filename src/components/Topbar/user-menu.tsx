import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { IconLogout2, IconUser } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/stores/userStore"

export default function UserMenu() {
  const { user, isAuthenticated, logout } = useUserStore();
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <Button variant="outline" asChild>
        <Link href={'/auth'}>
          Login
        </Link>
      </Button>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={user?.avatar || "/origin/avatar.jpg"} alt="Profile image" />
            <AvatarFallback>{user?.name ? user.name[0] : "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-foreground">
            {user?.name || "User"}
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {user?.username || "user@email.com"}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={'/profile'}>
              <IconUser size={16} className="opacity-60" aria-hidden="true" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await logout();
            router.push("/");
          }}
        >
          <IconLogout2 size={16} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SheetDownMenu({ onClose }: { onClose?: () => void }) {
  const { user, isAuthenticated, logout } = useUserStore();
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <div className="px-3 py-2">
        <Button variant="outline" className="w-full" asChild>
          <Link href={'/auth'} onClick={onClose}>
            Login
          </Link>
        </Button>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    if (onClose) onClose();
    router.push("/");
  };

  return (
    <div className="flex flex-col">
      {/* User Info Section */}
      <div className="flex items-center px-3 pb-2 gap-3 border-b">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.avatar || "/origin/avatar.jpg"} alt="Profile image" />
          <AvatarFallback>{user?.name ? user.name[0] : "U"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="truncate text-sm font-medium text-foreground">
            {user?.name || "User"}
          </span>
          <span className="truncate text-xs text-muted-foreground font-mono">
            {user?.username || "not-provided"}
          </span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col gap-1 py-2">
        <Link
          href="/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent rounded-md mx-2 transition-colors"
        >
          <IconUser size={18} className="text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-medium">Profile</span>
        </Link>
      </div>

      {/* Logout Button */}
      <div className="border-t pt-2 pb-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent rounded-md mx-2 transition-colors w-[calc(100%-1rem)] text-left"
        >
          <IconLogout2 size={18} className="text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-medium text-destructive">Logout</span>
        </button>
      </div>
    </div>
  );
}