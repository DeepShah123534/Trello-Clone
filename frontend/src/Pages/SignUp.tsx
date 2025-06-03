import {
  Box,
  Button,
  Input,
  Text
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios"; 
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  
} from "@chakra-ui/form-control";

const isInvalidEmail =(email:string) => {
    const emailFormat = /\S+@\S+\.\S+/;
    if (email.match(emailFormat) && email.length > 0) {
        return false;
    } else{
        return true;
    }
}

const isInvalidPass2 = (pass1: string, pass2: string) => {
    if(pass2 !== pass1) {
        return true;
    } else {
        return false;
    }
}


const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [secondPassword, setSecondPassword] = useState("");

    const [submitClickedName, setSubmitClickedName] = useState(false);
    const [submitClickedEmail, setSubmitClickedEmail] = useState(false);
    const [submitClicledUsername, setSubmitClickedUsername] = useState(false);
    const [submitClickedPassword, setSubmitClickedPassword] = useState(false);
    const [submitClickedSecondPassword, setSubmitClickedSecondPassword] = useState(false);

    const isErrorName = name === "" && submitClickedName;
    const isErrorEmail = isInvalidEmail(email) && submitClickedEmail;
    const isErrorUsername = username === "" && submitClicledUsername;
    const isErrorPassword = password === "" && submitClickedPassword;
    const isErrorSecondPassword = isInvalidPass2(password, secondPassword) && submitClickedSecondPassword;

    const onChangeName = (e:any) => {
        setSubmitClickedName(false);
        setName(e.target.value);
    };

    const onChangeEmail = (e:any) => {
        setSubmitClickedEmail(false);
        setEmail(e.target.value);
    };

    const onChangeUsername = (e:any) => {
        setSubmitClickedUsername(false);
        setUsername(e.target.value);
    };

    const onChangePassword = (e:any) => {
        setSubmitClickedPassword(false);
        setPassword(e.target.value);
    };

    const onChangeSecondPassword = (e:any) => {
        setSubmitClickedSecondPassword(false);
        setSecondPassword(e.target.value);
    };

    const onSubmit = () => {

        setSubmitClickedName(true);
        setSubmitClickedEmail(true);
        setSubmitClickedUsername(true);
        setSubmitClickedPassword(true);
        setSubmitClickedSecondPassword(true);
        

        console.log("ERROR NAME", isErrorName)

        if (name === "" 
        || isInvalidEmail(email) 
        || username === "" 
        || password === "" 
        || secondPassword !== password   
        || secondPassword === "") {
            return;
        }   
        else{
        axios.post("http://localhost:3000/auth/sign-up", {name, email, username, password
        }).then((response: any) => {
            console.log("RESPONSE ", response);
            setName("");
            setEmail("");
            setUsername("");
            setPassword("");
            setSecondPassword("");
            setSubmitClickedName(false);
            setSubmitClickedEmail(false);
            setSubmitClickedUsername(false);
            setSubmitClickedPassword(false);
            setSubmitClickedSecondPassword(false);
        });
        }
    };

    
    return (
        <Box>   
            <Text textAlign="center" mb={4} fontSize={20}>
                Create an Account
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
                <FormControl isInvalid={isErrorName} isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input w="100%" type="text" value={name} onChange={onChangeName} />
                    {!isErrorName ? null : (
                        <FormErrorMessage>Name's required</FormErrorMessage>
                    )}
                </FormControl>

                <FormControl isInvalid={isErrorEmail} isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input  w="100%" type="email" value={email} onChange={onChangeEmail} />
                    {!isErrorEmail ? null : (
                        <FormErrorMessage>A valid email address is requrired</FormErrorMessage>
                    )}
                </FormControl>

                <FormControl isInvalid={isErrorUsername} isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input w="100%" type="text" value={username} onChange={onChangeUsername} />
                    {!isErrorUsername ? null : (
                        <FormErrorMessage>Username is required</FormErrorMessage>
                    )}
                </FormControl>

                <FormControl isInvalid={isErrorPassword} isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input  w="100%" type="password" value={password} onChange={onChangePassword} />
                    {!isErrorPassword ? null : (
                        <FormErrorMessage>Password is required</FormErrorMessage>
                    )}
                </FormControl>

                <FormControl isInvalid={isErrorSecondPassword} isRequired>
                    <FormLabel>Re-enter your Password</FormLabel>
                    <Input  w="100%" type="password" value={secondPassword} onChange={onChangeSecondPassword} />
                    {!isErrorSecondPassword ? null : (
                        <FormErrorMessage>Password didn't match</FormErrorMessage>
                    )}
                </FormControl>

                <Button w="100%" onClick={onSubmit}>Submit</Button>
            </Box>
        </Box>
    );
};

export default SignUp;