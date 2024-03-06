import {
  Button,
  Flex,
  Input,
  LoadingOverlay,
  NumberInput,
  Text,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useAppContext } from "../context";
import { Filtro } from "./Filtro";
import { useEffect } from "react";

export function Busca() {
  const {
    appState: {
      dateInit,
      dateEnd,
      ecomLoader,
      limit,
      offset,
      ordersSelected,
      requestReviewAt,
    },
    updateAppState,
    fetch,
  } = useAppContext();

  useEffect(() => {
    const keys = [
      "dateInit",
      "dateEnd",
    ];
    const obj: any = {};
    keys.forEach((k: string) => {
      obj[k] = localStorage.getItem(k);
      if (obj[k]) {
        obj[k] = new Date(obj[k])
        updateAppState(obj);
      }
    });
  }, []);

  return (
    <Flex gap={10} direction="column">
      <LoadingOverlay
        visible={ecomLoader}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Text pt={20}>Selecione uma data para buscar pedidos</Text>

      <DatePickerInput
        description="Data inicial"
        value={dateInit}
        onChange={(value: any) => {
          localStorage.setItem("dateInit", value?.toISOString());
          updateAppState({ dateInit: value });
        }}
      />

      <DatePickerInput
        description="Data final"
        value={dateEnd}
        onChange={(value: any) => {
          localStorage.setItem("dateEnd", value?.toISOString());
          updateAppState({ dateEnd: value });
        }}
      />

      {ordersSelected.length > 0 && (
        <DatePickerInput
          description="Requisitar review em"
          value={requestReviewAt}
          onChange={(value) => {
            updateAppState({ requestReviewAt: value });
          }}
        />
      )}

      <Input.Wrapper description="Limite">
        <NumberInput
          value={limit}
          onChange={(value: any) => {
            localStorage.setItem("limit", value);
            updateAppState({ limit: value });
          }}
        />
      </Input.Wrapper>

      <Input.Wrapper description="Offset">
        <NumberInput
          value={offset}
          onChange={(value: any) => {
            localStorage.setItem("offset", value);
            updateAppState({ offset: value });
          }}
        />
      </Input.Wrapper>

      <Button color="red" variant="outline" onClick={fetch}>
        Buscar
      </Button>

      <Filtro />
    </Flex>
  );
}
