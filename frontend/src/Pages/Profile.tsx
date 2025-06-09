import { Context } from "../App";
import { Box, Text, Button} from "@chakra-ui/react";
import { useLoaderData, useNavigate, useOutletContext } from "react-router-dom";


const Profile = () => {

    const data = useLoaderData();
    const navigate = useNavigate();
    const context = useOutletContext() as Context;

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
        <Button onClick={logOut}> Log Out </Button>
    </Box>
  );
}

export default Profile;