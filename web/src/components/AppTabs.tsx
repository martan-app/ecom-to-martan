/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tabs, rem } from "@mantine/core";
import { useAppContext } from "../context";
import { Busca } from "./Busca";
import { Auth } from "./Auth";
import { IconSearch, IconSettings } from "@tabler/icons-react";

export function AppTabs() {
  const iconStyle = { width: rem(15), height: rem(15) };

  const {
    appState: { activeTab },
    updateAppState,
  } = useAppContext();

  function updateTab(value: any) {
    updateAppState({ activeTab: value });
  }

  return (
    <Tabs
      color="red"
      variant="outline"
      radius="xs"
      value={activeTab}
      onChange={updateTab}
    >
      <Tabs.List>
        <Tabs.Tab value="busca">
          <IconSearch style={iconStyle} /> Busca
        </Tabs.Tab>
        <Tabs.Tab value="auth">
          {" "}
          <IconSettings style={iconStyle} />
          Config
        </Tabs.Tab>
        {/* <Tabs.Tab value="sync">Sync</Tabs.Tab> */}
      </Tabs.List>

      <Tabs.Panel value="busca">
        <Busca />
      </Tabs.Panel>

      <Tabs.Panel value="auth">
        <Auth />
      </Tabs.Panel>

      <Tabs.Panel value="sync">Second panel</Tabs.Panel>
    </Tabs>
  );
}
