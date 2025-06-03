import { Provider } from "./components/ui/provider";
// import { ChakraProvider } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Header from "./components/ui/Header";

// function App() {
  
//   return (
//     <Provider>
      
//     </Provider>
//   );
// }

function App() {
  return (
  <Provider >
    <Header />
    <Outlet />
  </Provider>
  );
}


export default App;