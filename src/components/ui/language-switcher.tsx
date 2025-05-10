
import { Check, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 z-50">
        <DropdownMenuItem 
          onClick={() => setLanguage("en")}
          className="flex items-center justify-between cursor-pointer"
        >
          English {language === "en" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => setLanguage("fr")}
          className="flex items-center justify-between cursor-pointer"
        >
          Français {language === "fr" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => setLanguage("ar")}
          className="flex items-center justify-between cursor-pointer"
        >
          العربية {language === "ar" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
