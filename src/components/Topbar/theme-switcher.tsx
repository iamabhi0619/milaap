
import { IconMoon, IconSun } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <Button onClick={toggleTheme} className="cursor-pointer text-foreground" variant={'link'} size={'icon'}>
            {theme !== "dark" ? (
                <IconSun size={16} />
            ) : (
                <IconMoon size={16} />
            )}
        </Button>
    );
}