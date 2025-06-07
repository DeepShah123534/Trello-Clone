import { Provider } from "./components/ui/provider";
import { Outlet } from "react-router-dom";
import Header from "./components/ui/Header";
 



function App() {
  return (
    <Provider>

      <Header />
      <Outlet />
    </Provider>
  );
}

export default App;