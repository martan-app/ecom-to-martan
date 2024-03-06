/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Checkbox,
  Flex,
  ScrollArea,
  Table,
  Text,
  ThemeIcon,
  rem,
} from "@mantine/core";
import cx from "clsx";
import { useAppContext } from "../context";
import classes from "./TableSelection.module.css";
import { IconCircleCheck, IconCircleDashed, IconError404 } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export function Tabela() {
  const [data, setData] = useState<any>([])
  
  const {
    appState: {
      orders,
      filtered,
      ordersSelected,
      synchronizedOrders,
      syncWithError,
    },
    updateAppState,
  } = useAppContext();

  useEffect(() => {
    setData(filtered.length ? filtered : orders)
  }, [orders, filtered])

  const toggleRow = (id: string) => {
    updateAppState({
      ordersSelected: ordersSelected.includes(id)
        ? ordersSelected.filter((item: any) => item !== id)
        : [...ordersSelected, id],
    });
  };

  const toggleAll = () => {
    updateAppState({
      ordersSelected:
        ordersSelected.length === data?.length
          ? []
          : data?.map((item: any) => item._id),
    });
  };

  function isSyncOrNotOrError(item: any) {
    if (synchronizedOrders.includes(item._id)) {
      return (
        <ThemeIcon color="teal" size={24} radius="xl">
          <IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
        </ThemeIcon>
      );
    } else if (
      !synchronizedOrders.includes(item._id) &&
      syncWithError.includes(item._id)
    ) {
      return (
        <ThemeIcon color="red" size={24} radius="xl">
          <IconError404 style={{ width: rem(16), height: rem(16) }} />
        </ThemeIcon>
      );
    } else {
      return (
        <ThemeIcon color="blue" size={24} radius="xl">
          <IconCircleDashed style={{ width: rem(16), height: rem(16) }} />
        </ThemeIcon>
      );
    }
  }

  const rows = data?.map((item: any) => {
    const selected = ordersSelected.includes(item.id);

    return (
      <Table.Tr
        key={item._id}
        className={cx({ [classes.rowSelected]: selected })}
      >
        <Table.Td>
          <Checkbox
            checked={ordersSelected.includes(item._id)}
            onChange={() => toggleRow(item._id)}
          />
        </Table.Td>

        <Table.Td>{item.number}</Table.Td>

        <Table.Td>
          <Flex direction="column" gap="sm">
            <Text size="sm" fw={500}>
              {item?.buyers[0].display_name}
            </Text>

            <Text size="sm" fw={500}>
              {item?.buyers[0].main_email}
            </Text>
          </Flex>
        </Table.Td>

        <Table.Td>
          {item?.amount.subtotal?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Table.Td>

        <Table.Td>{item?.fulfillment_status?.current}</Table.Td>

        <Table.Td>
          {new Date(item?.created_at).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Table.Td>

        <Table.Td>
          {isSyncOrNotOrError(item)}
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <ScrollArea>
      <Table miw={800} verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: rem(40) }}>
              <Checkbox
                onChange={toggleAll}
                checked={ordersSelected.length === data?.length}
                indeterminate={
                  ordersSelected.length > 0 &&
                  ordersSelected.length !== data?.length
                }
              />
            </Table.Th>

            <Table.Th>Número</Table.Th>
            <Table.Th>Cliente</Table.Th>
            <Table.Th>Total</Table.Th>
            <Table.Th>Entrega</Table.Th>
            <Table.Th>Data</Table.Th>
            <Table.Th>Sincronizado</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
