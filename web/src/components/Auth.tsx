/* eslint-disable @typescript-eslint/no-explicit-any */
import { Flex, Input, NumberInput, PasswordInput, Text } from "@mantine/core";
import { useAppContext } from "../context";
import { useEffect } from "react";

export function Auth() {
  const {
    appState: {
      ecomAuthID,
      ecomStoreID,
      ecomToken,
      martanStoreID,
      martanToken,
    },
    updateAppState,
  } = useAppContext();

  useEffect(() => {
    const keys = [
      "ecomAuthID",
      "ecomStoreID",
      "ecomToken",
      "martanStoreID",
      "martanToken",
    ];
    const obj: any = {};
    keys.forEach((k: string) => {
      obj[k] = localStorage.getItem(k);
      if (obj[k]) {
        updateAppState(obj);
      }
    });
  }, []);

  return (
    <Flex gap={10} direction="column">
      <Text pt={20}>Autenticação E-Com.Plus</Text>

      <Input.Wrapper label="Token" withAsterisk description="Token e-com.plus">
        <PasswordInput
          value={ecomToken}
          onChange={(value) => {
            localStorage.setItem("ecomToken", value.target.value);
            updateAppState({ ecomToken: value.target.value });
          }}
        />
      </Input.Wrapper>

      <Input.Wrapper
        label="Autentication ID"
        withAsterisk
        description="Autentication ID e-com.plus"
        error=""
      >
        <PasswordInput
          value={ecomAuthID}
          onChange={(value) => {
            localStorage.setItem("ecomAuthID", value.target.value);
            updateAppState({ ecomAuthID: value.target.value });
          }}
        />
      </Input.Wrapper>

      <Input.Wrapper
        label="StoreID"
        withAsterisk
        description="StoreID e-com.plus"
      >
        <NumberInput
          value={ecomStoreID}
          onChange={(value: any) => {
            localStorage.setItem("ecomStoreID", value);
            updateAppState({ ecomStoreID: value });
          }}
        />
      </Input.Wrapper>

      <Text pt={20}>Autenticação Martan</Text>

      <Input.Wrapper
        label="Token"
        withAsterisk
        description="Token martan.app"
        error=""
      >
        <PasswordInput
          value={martanToken}
          onChange={(value) => {
            localStorage.setItem("martanToken", value.target.value);
            updateAppState({ martanToken: value.target.value });
          }}
        />
      </Input.Wrapper>

      <Input.Wrapper
        label="StoreID"
        withAsterisk
        description="StoreID martan.app"
        error=""
      >
        <NumberInput
          value={martanStoreID}
          onChange={(value: any) => {
            localStorage.setItem("martanStoreID", value);
            updateAppState({ martanStoreID: value });
          }}
        />
      </Input.Wrapper>
    </Flex>
  );
}
