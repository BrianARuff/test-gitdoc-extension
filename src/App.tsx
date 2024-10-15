import "./App.css";
import { Combobox, ComboxBoxOption } from "./ComboBox";

const options = [
  "Choose a Fruit",
  "Apple",
  "Banana",
  "Blueberry",
  "Boysenberry",
  "Cherry",
  "Cranberry",
  "Durian",
  "Eggplant",
  "Fig",
  "Grape",
  "Guava",
  "Huckleberry",
  "Apple",
  "Banana",
  "Blueberry",
  "Boysenberry",
  "Cherry",
  "Cranberry",
  "Durian",
  "Eggplant",
  "Fig",
  "Grape",
  "Guava",
  "Huckleberry",
  "Apple",
  "Banana",
  "Blueberry",
  "Boysenberry",
  "Cherry",
  "Cranberry",
  "Durian",
  "Eggplant",
  "Fig",
  "Grape",
  "Guava",
  "Huckleberry",
  "Huckleberry",
  "Apple",
  "Banana",
  "Blueberry",
  "Boysenberry",
  "Cherry",
  "Cranberry",
  "Durian",
  "Eggplant",
  "Fig",
  "Grape",
  "Guava",
  "Huckleberry",
  "Huckleberry",
  "Apple",
  "Banana",
  "Blueberry",
  "Boysenberry",
  "Cherry",
  "Cranberry",
  "Durian",
  "Eggplant",
  "Fig",
  "Grape",
  "Guava",
  "Huckleberry",
  "Huckleberry",
  "Apple",
  "Banana",
  "Blueberry",
  "Boysenberry",
  "Cherry",
  "Cranberry",
  "Durian",
  "Eggplant",
  "Fig",
  "Grape",
  "Guava",
  "Huckleberry",
  "Huckleberry",
  "Apple",
  "Banana",
  "Blueberry",
  "Boysenberry",
  "Cherry",
  "Cranberry",
  "Durian",
  "Eggplant",
  "Fig",
  "Grape",
  "Guava",
  "Huckleberry",
];

function App() {
  const formattedOptions: ComboxBoxOption[] = options?.map<ComboxBoxOption>(
    (option, index): ComboxBoxOption => {
      const formattedOption = {
        label: option,
        value: options + "__" + index,
        index: index,
      };

      return formattedOption;
    }
  );
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100dvw",
      }}
    >
      <Combobox
        renderLabelSpan={() => {
          return "Favorite Fruit";
        }}
        renderListOption={(props) => {
          return <p>{props?.option?.label}</p>;
        }}
        options={formattedOptions}
      />
    </div>
  );
}

export default App;
