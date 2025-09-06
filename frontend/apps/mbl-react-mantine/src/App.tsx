import React from "react";
import "./App.css";
import { MixBoxLayout } from "@xxs3315/mbl-lib";
import { contents } from "@xxs3315/mbl-lib-example-data";
import "@xxs3315/mbl-lib/dist/index.css";
import { useDisclosure } from "@mantine/hooks";
import { AppShell, Burger, Group } from "@mantine/core";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { useTheme } from "./providers/ThemeProvider";

const App = () => {
  const [opened, { toggle }] = useDisclosure();
  const { currentTheme, setTheme } = useTheme();
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
          <ThemeSwitcher currentTheme={currentTheme} onThemeChange={setTheme} />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        Navbar is collapsed on mobile at sm breakpoint. At that point it is no
        longer offset by padding in the main element and it takes the full width
        of the screen when opened.
      </AppShell.Navbar>
      <AppShell.Main style={{ display: "flex", height: "100vh" }}>
        <MixBoxLayout
          id={"ddb14a5da2a5423e862e3e9afd58f776"}
          contents={contents}
          onContentChange={(updatedContents) => {
            console.log(updatedContents);
          }}
          theme={currentTheme}
          // baseUrl={"https://vmagrid.cn/pdf-back"}
          // imageUploadPath={"/api/pdf/upload-image"}
        />
      </AppShell.Main>
    </AppShell>
  );
};

export default App;
