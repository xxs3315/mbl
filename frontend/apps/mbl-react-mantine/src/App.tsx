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
import AboutPage from "./components/AboutPage";
import reactLogo from "./assets/react.svg";
import mantineLogo from "./assets/mantine.svg";

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
            <div className="logo-section">
              <img src="/vite.svg" className="logo" alt="Vite logo" />
              <img src={reactLogo} className="logo react" alt="React logo" />
              <img
                src={mantineLogo}
                className="logo mantine"
                alt="Mantine logo"
              />
              <span className="app-title">
                Vite + React + Mantine + MBL Demo App
              </span>
            </div>
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
        <NavLink
          component={Link}
          to="/"
          label="MBL Designer"
          active={isActive("/")}
        />
        <NavLink
          component={Link}
          to="/about"
          label="About"
          active={isActive("/about")}
        />
      </AppShell.Navbar>
      <AppShell.Main
        style={{ display: "flex", height: "100vh", background: "#f2f3f5" }}
      >
        <Routes>
          <Route path="/" element={<Designer />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
};

const App: React.FC<AppProps> = ({ baseUrl = "http://localhost:29080" }) => {
  return (
    <Router>
      <LocaleProvider>
        <AppContent baseUrl={baseUrl} />
      </LocaleProvider>
    </Router>
  );
};

export default App;
