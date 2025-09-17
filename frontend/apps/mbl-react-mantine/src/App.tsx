import React from "react";
import "./App.css";
import { useDisclosure } from "@mantine/hooks";
import { AppShell, Burger, Group, NavLink } from "@mantine/core";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import {
  LanguageSwitcher,
  type SupportedLocale,
} from "./components/LanguageSwitcher";
import { useTheme } from "./providers/ThemeProvider";
import { useLocale, LocaleProvider } from "./providers/LocaleProvider";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Designer from "./components/Designer";
import TaskCenter from "./components/TaskCenter";
import Homepage from "./components/Homepage";

interface AppProps {
  baseUrl?: string;
}

const AppContent: React.FC<{ baseUrl: string }> = ({ baseUrl }) => {
  const [opened, { toggle }] = useDisclosure();
  const { currentTheme, setTheme } = useTheme();
  const { currentLocale, setLocale } = useLocale();
  const location = useLocation();

  const handleLocaleChange = (locale: SupportedLocale) => {
    console.log("App: Changing locale from", currentLocale, "to", locale);
    setLocale(locale);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            Header
          </Group>
          <Group>
            <LanguageSwitcher
              currentLocale={currentLocale}
              onLocaleChange={handleLocaleChange}
            />
            <ThemeSwitcher
              currentTheme={currentTheme}
              onThemeChange={setTheme}
            />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <NavLink component={Link} to="/" label="首页" active={isActive("/")} />
        <NavLink
          component={Link}
          to="/designer"
          label="设计器"
          active={isActive("/designer")}
        />
      </AppShell.Navbar>
      <AppShell.Main
        style={{ display: "flex", height: "100vh", background: "#f2f3f5" }}
      >
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/designer" element={<Designer />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
};

const App: React.FC<AppProps> = ({ baseUrl = "http://localhost:8080" }) => {
  return (
    <Router>
      <LocaleProvider>
        <AppContent baseUrl={baseUrl} />
      </LocaleProvider>
    </Router>
  );
};

export default App;
