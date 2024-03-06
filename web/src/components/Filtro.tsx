/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chip, Flex, Text, rem } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useAppContext } from "../context";

export function Filtro() {
  const [filtro, setFiltro] = useState<any>(null);
  const {
    appState: { orders, synchronizedOrders, syncWithError },
    updateAppState,
  } = useAppContext();

  console.log(filtro);

  useEffect(() => {
    if (!filtro) {
      updateAppState({
        filtered: [],
      });
    } else {
      switch (filtro) {
        case "send":
          updateAppState({
            filtered: orders.filter((order) =>
              synchronizedOrders.includes(order._id)
            ),
          });
          break;
        case "error":
          updateAppState({
            filtered: orders.filter((order) =>
              syncWithError.includes(order._id)
            ),
          });
          break;
        case "not_sync":
          updateAppState({
            filtered: orders.filter(
              (order) =>
                !syncWithError.includes(order._id) &&
                !synchronizedOrders.includes(order._id)
            ),
          });
          break;
        default:
          break;
      }
    }
  }, [filtro, orders, syncWithError, synchronizedOrders]);

  return (
    <Flex direction="column" gap={15}>
      <Text>Filtrar</Text>

      <Chip.Group multiple={false} value={filtro} onChange={setFiltro}>
        <Chip
          icon={<IconX style={{ width: rem(16), height: rem(16) }} />}
          color="red"
          variant="filled"
          value="error"
        >
          Com Erro
        </Chip>

        <Chip
          icon={<IconX style={{ width: rem(16), height: rem(16) }} />}
          color="blue"
          variant="filled"
          value="not_sync"
        >
          Não enviado
        </Chip>

        <Chip
          icon={<IconX style={{ width: rem(16), height: rem(16) }} />}
          color="green"
          variant="filled"
          value="send"
        >
          Enviado
        </Chip>
      </Chip.Group>
    </Flex>
  );
}
