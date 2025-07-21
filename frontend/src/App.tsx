import { Provider } from "./components/ui/provider";
import { Outlet, useLoaderData } from "react-router-dom";
import Header from "./components/ui/Header";
import { Toaster } from "./components/ui/toaster"

import { useState } from "react";
 
type Data = {
  email: string;
  name: string;
  username: string;
}


function App() {
  const data = useLoaderData() as Data | undefined;
  const [loggedIn,setLoggedIn] = useState(data?.username !== undefined);

  const toggleLoggedIn = () => {
    setLoggedIn(!loggedIn);
  };

  const context: Context = {
    loggedIn,
    toggleLoggedIn,
  };

  console.log("App data:", data);
  console.log("App loggedIn:", loggedIn);

  return (
    <Provider>
      <Header loggedIn={loggedIn}/>
      <Outlet context={context}/>
      <Toaster />
    </Provider>
  );
}

export type Context = {
  loggedIn: boolean;
  toggleLoggedIn: () => void;
}

export default App;