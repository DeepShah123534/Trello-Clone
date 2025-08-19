import { Box, Button, Text } from '@chakra-ui/react';
import React from 'react'
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box mt={20}>   
        <Text textAlign="center" mb={4} fontSize={20}>
            Your only tool for project planning needs.
        </Text>
        <Text layerStyle="text" textAlign="center" pb={20} margin="0 auto">
            You can create projects, add features to those projects,
            add user stories to those features, and also add developer tasks to those user stories.  

        </Text>

        <Box display="flex" gap={7} justifyContent="center" mx={2} >

          <Link to="/log-in">
            <Button > Log In </Button>
          </Link>

          <Link to="/sign-up">
            <Button > Create an account </Button>
        </Link>

        </Box>
    </Box>  
  )
}

export default Home;