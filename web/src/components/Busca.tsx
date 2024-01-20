import { Button, Flex, LoadingOverlay, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useAppContext } from "../context";

export function Busca() {
  const {
    appState: { dateInit, dateEnd, ecomLoader },
    updateAppState,
    fetch,
  } = useAppContext();

  return (
    <Flex gap={10} direction="column">
      <LoadingOverlay
        visible={ecomLoader}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Text pt={20}>Selecione uma data para buscar pedidos</Text>

      <DatePickerInput
        label="Data inicial"
        placeholder="Data inicial"
        value={dateInit}
        onChange={(value) => {
          updateAppState({ dateInit: value });
        }}
      />

      <DatePickerInput
        label="Data final"
        placeholder="Data final"
        value={dateEnd}
        onChange={(value) => {
          updateAppState({ dateEnd: value });
        }}
      />

      <Button color="red" variant="outline" onClick={fetch}>
        Buscar
      </Button>
    </Flex>
  );
}
