import { Button, Flex, Progress, Text } from "@mantine/core";
import { useAppContext } from "../context";

function SyncProgress() {
  const {
    appState: { syncCount, ordersSelected },
  } = useAppContext();

  const porcentagem = (syncCount / ordersSelected.length) * 100;

  return (
    <Progress.Root size={35}>
      <Progress.Section
        value={+porcentagem.toFixed()}
        color="orange"
      >
        <Progress.Label>Sincronização ({porcentagem.toFixed()}%) - Total Sincronizado {syncCount}</Progress.Label>
      </Progress.Section>
    </Progress.Root>
  );
}

export function Footer() {

  const {
    appState: { isSync, ordersSelected },
    syncSelected,
  } = useAppContext();

  if (isSync) {
    return <SyncProgress />;
  }

  if (!ordersSelected.length) return null;

  return (
    <Flex align="center" justify="space-between">
      <Text>{ordersSelected.length} pedidos selecionados</Text>

      <Button onClick={syncSelected}>Sincronizar Selecionados</Button>
    </Flex>
  );
}
