import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { I18N_LANGUAGES, Language } from '@/i18n/config';
import {
  BetweenHorizontalStart,
  Coffee,
  CreditCard,
  FileText,
  Globe,
  Moon,
  Settings,
  Shield,
  User,
  UserCircle,
  Users,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/providers/i18n-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import LoginService from '@/lib/api/login-service';
import SharedPreferences from '@/lib/shared-preferences';

export function UserDropdownMenu({ trigger }: { trigger: ReactNode }) {
  const router = useRouter();
  const { changeLanguage, language } = useLanguage();
  const { theme, setTheme } = useTheme();
  
  // Get user data from shared preferences
  const userData = SharedPreferences.getAuthData();

  const handleLanguage = (lang: Language) => {
    changeLanguage(lang.code);
  };

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  const handleLogout = () => {
    SharedPreferences.clearAuthData();
    // Force redirect to signin page
    window.location.href = '/signin';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" side="bottom" align="end">
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <img
              className="w-9 h-9 rounded-full border border-border"
              src={'/media/avatars/admin-lucille.jpg'}
              alt="User avatar"
            />
            <div className="flex flex-col">
              <Link
                href="#"
                className="text-sm text-mono hover:text-primary font-semibold"
              >
                User ID: {userData.user_id || 'N/A'}
              </Link>
              <Link
                href="mailto:c.fisher@gmail.com"
                className="text-xs text-muted-foreground hover:text-primary"
              >
                Role: {userData.user_role || 'N/A'}
              </Link>
            </div>
          </div>
          <Badge variant="primary" appearance="outline" size="sm">
            Admin
          </Badge>
        </div>

        <DropdownMenuSeparator />

      
        <DropdownMenuItem asChild>
          <Link
            href="/settings-admin/master-settings"
            className="flex items-center gap-2"
          >
            <User />
            Account
          </Link>
        </DropdownMenuItem>

       

       


        <DropdownMenuSeparator />

        {/* Footer */}
       
        <div className="p-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
