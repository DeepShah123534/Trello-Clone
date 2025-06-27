import { isInvalidEmail } from '../../../Pages/SignUp';
import { Box, Button, Input, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

const ForgotPassword = ({ isOpen, onClose }: Props) => {
  const [email, setEmail] = useState("");

  const saveEmail = (e:any) => {
    setEmail(e.target.value)
  };

  const submitEmail = () => {
    console.log("EMAIL: ", email)
    const invalidEmail = isInvalidEmail(email)
    if (invalidEmail) {
          alert("Please enter a valid email address!");
          onClose();
        }
    else {
        axios
      .post("http://localhost:3000/auth/reset-password", {
        email,
      })
      .then((response) => {
        setEmail("");
        console.log("RESPONSE", response.data)
        alert("Check you email for further directions")
      }).catch((error) => {
        console.log('ERROR: ', error)
        alert(error.response.data.message)
      })
   
    }
     onClose();
  }

  
  return (
    <>
      {/* Fullscreen dark background */}
      <Box
        position="fixed"
        top={0}
        left={0}
        w="100vw"
        h="100vh"
        bg="blackAlpha.600"
        zIndex={999}
        onClick={onClose}
      />

      {/* Centered modal */}
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        bg="gray.50"
        p={6}
        borderRadius="md"
        boxShadow="lg"
        zIndex={1000}
        w="90%"
        maxW="450px"
        onClick={(e) => e.stopPropagation()}

      >
        <Text mb={3} color="black" textAlign="center">
          Enter the email address associated with your account:
        </Text>
        <Input
          placeholder="you@example.com"
          value={email}
          onChange={saveEmail}
          mb={4}
          color="black"
        />
        <Button
          _hover={{ bg: 'gray.300' }}
          w="100%"
          mb={2}
          onClick={submitEmail}
        >
          Send Verification Email
        </Button>
        <Button _hover={{ bg: 'gray.300' }} w="100%" onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </>
  );
};

export default ForgotPassword;