import { AppShell, Burger, Group, Image } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import { AppTabs } from "./AppTabs";
import { Footer } from "./Footer";

interface Props {
  children?: React.ReactChild;
}

export function Shell({ children }: Props) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      // aside={{
      //   width: 300,
      //   breakpoint: "md",
      //   collapsed: { desktop: false, mobile: true },
      // }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Image
            src="https://ik.imagekit.io/2wovc1fdm/storefront-widget.png"
            maw="124px"
          />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppTabs />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>

      {/* <AppShell.Aside p="md">Aside</AppShell.Aside> */}

      <AppShell.Footer p="md">
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
}
