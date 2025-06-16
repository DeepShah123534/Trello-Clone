"use client"
import { Context } from "../App";
import { useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
import {  Box, Text, Button, Avatar} from "@chakra-ui/react";
import UserDetailsRow from "../components/ui/Profile/UserDetailsRow";


type Data = {
  email: string;
  name: string;
  username: string;
}

const Profile = () => {
    
    const data = useLoaderData() as Data; 
    const navigate = useNavigate();
    const context = useOutletContext() as Context;
  
    console.log(' PROFILE DATA: ', data )

    const logOut = () => {
        localStorage.removeItem("token");
        context.toggleLoggedIn();
        navigate("/log-in");
        alert("You have been logged out of your account");
    }
  return (
    <Box>   
        <Text textAlign="center" mb={4} fontSize={20}>
            Account Details 
        </Text>
        <Text textAlign="center">Welcome, {data.name}! You can manage your account detials here.</Text>
        
        <Box display="flex" m="0 auto" w="60%" gap={10} py={20}>

          <Box mt={8}>
            <Avatar.Root  height="105px" width="105px" bg="cyan.500" >
              <Avatar.Fallback name={data.name} fontSize="4xl" color="blackAlpha.900"/>
            </Avatar.Root>
          </Box>

          <Box w="100%" gap={3} display="flex" flexDirection="column">

            <UserDetailsRow field="Name" value={data.name} />
            <UserDetailsRow field="Email" value={data.email} />
            <UserDetailsRow field="Username" value={data.username} />
            <UserDetailsRow field="Password" value="********"/>

          </Box>

        </Box>

        <Box display="flex" gap={7} justifyContent="center">
          <Button onClick={logOut}> Log Out </Button>
          <Button onClick={() => {}}> Delete Account </Button>
        </Box>
    </Box>
  );
}

export default Profile;