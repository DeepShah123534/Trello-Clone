import { Context } from '@/App';
import ForgotPassword from '../components/ui/Login/ForgotPassword';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control';
import { Box, Button, Input, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const LogIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showReset, setShowReset] = useState(false);
  

  const navigate = useNavigate();
  const context = useOutletContext() as Context;

  const [submitClicledUsername, setSubmitClickedUsername] = useState(false);
  const [submitClickedPassword, setSubmitClickedPassword] = useState(false);

  const isErrorUsername = username === "" && submitClicledUsername;
  const isErrorPassword = password === "" && submitClickedPassword;

  const onChangeUsername = (e: any) => {
    setSubmitClickedUsername(false);
    setUsername(e.target.value);
  };

  const onChangePassword = (e: any) => {
    setSubmitClickedPassword(false);
    setPassword(e.target.value);
  };

  const onSubmit = () => {
    setSubmitClickedUsername(true);
    setSubmitClickedPassword(true);

    if (username === "" || password === "") return;

    axios
      .post("http://localhost:3000/auth/log-in", {
        username,
        password,
      })
      .then((response: any) => {
        const token = response.data;
        context.toggleLoggedIn();
        localStorage.setItem("token", token);

        setUsername("");
        setPassword("");
        setSubmitClickedUsername(false);
        setSubmitClickedPassword(false);

        alert(`Sign in successful! Welcome ${username}`);
        navigate("/projects");
      })
      .catch((error) => {
        console.error("ERROR: ", error);
        alert("There was an error logging in.");
      });
  };

  return (
    <Box position="relative">
      <Text textAlign="center" mb={4} fontSize={20}>
        Log Into Your Account
      </Text>

      <Box
        maxW="75%"
        w="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        margin="0 auto"
        gap={4}
      >
        <FormControl w="100%" isInvalid={isErrorUsername} isRequired>
          <FormLabel>Username</FormLabel>
          <Input type="text" value={username} onChange={onChangeUsername} />
          {!isErrorUsername ? null : (
            <FormErrorMessage>Username is required</FormErrorMessage>
          )}
        </FormControl>

        <FormControl w="100%" isInvalid={isErrorPassword} isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={onChangePassword} />
          {!isErrorPassword ? null : (
            <FormErrorMessage>Password is required</FormErrorMessage>
          )}
        </FormControl>

        <Button w="100%" onClick={onSubmit}>
          Submit
        </Button>
      </Box>

      <Box display="flex" mt={20} justifyContent="center" alignItems="center" gap={5}>
        <Text>Forgot You Password?</Text>
          <Button onClick={() => setShowReset(true)}>Reset Your Password</Button>

      {showReset && <ForgotPassword onClose={() => setShowReset(false)} isOpen={false} />}
      </Box>
      

    </Box>
  );
};

export default LogIn;