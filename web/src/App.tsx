// core styles are required for all packages
import "@mantine/core/styles.css";
import "dayjs/locale/pt";

// other css files are required only if
// you are using components from the corresponding package
import "@mantine/dates/styles.css";
// import '@mantine/dropzone/styles.css';
// import '@mantine/code-highlight/styles.css';
// ...
import {
  createTheme,
  MantineColorsTuple,
  MantineProvider,
} from "@mantine/core";
import { ImportacaoUI } from "./components/Importacao";
import { Shell } from "./components/Shell";
import { AppProvider } from "./context";
import { DatesProvider } from "@mantine/dates";

const myColor: MantineColorsTuple = [
  "#e5feee",
  "#d2f9e0",
  "#a8f1c0",
  "#7aea9f",
  "#53e383",
  "#3bdf70",
  "#2bdd66",
  "#1ac455",
  "#0caf49",
  "#00963c",
];

const theme = createTheme({
  colors: {
    myColor,
  },
});

function App() {
  return (
    <AppProvider>
      <MantineProvider theme={theme}>
        <DatesProvider settings={{ locale: "pt" }}>
          <Shell>
            <ImportacaoUI />
          </Shell>
        </DatesProvider>
      </MantineProvider>
    </AppProvider>
  );
}

export default App;
