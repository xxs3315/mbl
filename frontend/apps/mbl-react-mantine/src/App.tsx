import React from "react";
import "./App.css";
import { MixBoxLayout } from "@xxs3315/mbl-lib";
import { contents } from "@xxs3315/mbl-lib-example-data";
import "@xxs3315/mbl-lib/index.css";
import { tablePlugin } from "@xxs3315/mbl-lib-plugin-table";
import { useDisclosure } from "@mantine/hooks";
import { AppShell, Burger, Group } from "@mantine/core";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import {
  LanguageSwitcher,
  type SupportedLocale,
} from "./components/LanguageSwitcher";
import { useTheme } from "./providers/ThemeProvider";

const App = () => {
  const [opened, { toggle }] = useDisclosure();
  const { currentTheme, setTheme } = useTheme();
  const [currentLocale, setCurrentLocale] =
    React.useState<SupportedLocale>("zh-CN");

  const handleLocaleChange = (locale: SupportedLocale) => {
    console.log("App: Changing locale from", currentLocale, "to", locale);
    setCurrentLocale(locale);
  };

  // 定义插件列表
  const plugins = [
    {
      metadata: tablePlugin.metadata,
      plugin: tablePlugin,
    },
  ];

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
        Navbar is collapsed on mobile at sm breakpoint. At that point it is no
        longer offset by padding in the main element and it takes the full width
        of the screen when opened.
      </AppShell.Navbar>
      <AppShell.Main
        style={{ display: "flex", height: "100vh", background: "#f2f3f5" }}
      >
        <MixBoxLayout
          id={"ddb14a5da2a5423e862e3e9afd58f776"}
          contents={contents}
          onContentChange={(updatedContents) => {
            console.log(updatedContents);
          }}
          theme={currentTheme}
          locale={currentLocale}
          baseUrl={"http://localhost:8080"}
          imageUploadPath={"/api/images/upload"}
          imageDownloadPath={"api/images"}
          plugins={plugins}
          enablePluginSystem={true}
        />
      </AppShell.Main>
    </AppShell>
  );
};

export default App;
