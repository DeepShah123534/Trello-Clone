import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/form-control";
import { Box, Button, Input, Text } from "@chakra-ui/react"
import { useNavigate, useParams } from "react-router-dom";
import { toaster } from "../components/ui/toaster";

import { useState } from "react";
import axios from "axios";

const ResetPassword = () => {

  const { id, token } = useParams();

  const navigate = useNavigate();
  
  
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");

  const [submitPassword, setSubmitPassword] = useState(false);
  const [submitSecondPassword, setSubmitSecondPassword] = useState(false);

  const isErrorPassword = password === "" && submitPassword;
  const isErrorSecondPassword = password !== secondPassword && submitSecondPassword;

    const onChangePassword = (e: any) => {
    setSubmitPassword(false);
    setSubmitSecondPassword(false);
    setPassword(e.target.value);
    };

    const onChangeSecondPassword = (e: any) => {
    setSubmitSecondPassword(false);
    setSecondPassword(e.target.value);
    };

    const onSubmit = () => {

        setSubmitPassword(true);
        setSubmitSecondPassword(true);

        axios
        .post("http://localhost:3000/auth/save-new-password", {
          newPassword: password,
          id,
          token,
        })  
        .then((response) => {
        setPassword("");
        setSecondPassword("");
        navigate("/log-in");
                toaster.success({
                    title: "success",
                    description: "Password reset successfully. You can now log in with your new password.",
                    closable: true,
                  });
        
        })
        .catch((error) => {
          toaster.error({
           title: "error",
           description: "Error resetting password. Please try again.",
           closable: true,
         });

        })
    }


    return (

      <Box position="relative">
      <Text textAlign="center" mb={4} fontSize={20}>
        Reset Your Password
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
    

        <FormControl w="100%" isInvalid={isErrorPassword} isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={onChangePassword} />
          {!isErrorPassword ? null : (
            <FormErrorMessage>Password is required</FormErrorMessage>
          )}
        </FormControl>

        <FormControl w="100%" isInvalid={isErrorSecondPassword} isRequired>
          <FormLabel>Re-enter Password</FormLabel>
          <Input type="password" value={secondPassword} onChange={onChangeSecondPassword} />
          {!isErrorSecondPassword ? null : (
            <FormErrorMessage>Passwords most match</FormErrorMessage>
          )}
        </FormControl>

        <Button w="100%" onClick={onSubmit}>
          Submit
        </Button>
      </Box>
      

    </Box>
    )
}

export default ResetPassword;