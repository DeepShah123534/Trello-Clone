import { Provider } from "./components/ui/provider";
import { Box, Button} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { Input } from "@chakra-ui/react"

function App() {
  const  [firstName, setFirstName] = useState("Deep")
  const  [lastName, setLastName] = useState("Shah")

  const onChangeFirstName = (event: any) => {
    setFirstName(event.target.value);
  }

  const onChangeLastName = (event: any) => {
    setLastName(event.target.value);
  }

  const onClick = async () => {
    const response = await axios.post("http://localhost:3000/name", {
      firstName,
      lastName,
    });
    console.log("RESPONSE", response)
  };
  return (
    <Provider>
      <Box m={10} display="flex" gap={4}>
        <Input onChange={onChangeFirstName} placeholder="Type your first name..."/>
        <Input onChange={onChangeLastName} placeholder="Type your last name..."/>
        <Button colorScheme="green" onClick={onClick}>Add name</Button>
      </Box>
    </Provider>
  );
}

export default App;