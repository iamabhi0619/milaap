'use client';
import Link from "next/link";

import NotificationMenu from "./notification-menu";
import Logo from "@/assets/Logo";
import UserMenu from "./user-menu";
import SettingsMenu from "./settings-menu";
import ThemeSwitcher from "./theme-switcher";



export default function Topbar() {

    return (
        <div className="">

            <div className="flex items-center justify-between  max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-2">

                {/* Left: Logo + Mobile Menu */}
                <div className="flex items-center gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Logo className="h-9 w-9" />
                        <span className="hidden md:block font-bold text-lg">Milaap</span>
                    </Link>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    <NotificationMenu />
                    <ThemeSwitcher />
                    <SettingsMenu />
                    <UserMenu />
                </div>
            </div>
        </div>
    );
}
