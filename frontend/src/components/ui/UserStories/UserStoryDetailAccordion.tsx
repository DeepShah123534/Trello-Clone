import { Accordion, Box, Text } from "@chakra-ui/react"
import { useState } from "react";

type Props = {
    name: string;
    status: string;
    description: string;
}

const UserStoryDetailAccordion = ( {name, status, description}: Props ) => {

      const [isOpen, setIsOpen] = useState(false);
    return (

        <Box >
            <Accordion.Root collapsible index={isOpen ? [0] : [1]} border="1px solid"  >
                <Accordion.Item >
                <Accordion.ItemTrigger  onClick={() => setIsOpen(false)}  p={4} mx={4} 
                          
                      display="flex"
                      justifyContent="space-between"
                        _hover={{cursor:"pointer"}}
                        
                        w="100%">
                              
                        <Text flex={1}  mt={3}>{name}</Text>
                        <Text mt={3}>{status}</Text>                                       
         
                    <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                    <Accordion.ItemBody borderTop="1px solid" >
                        <Text ml={8} mt={5}>{description}</Text>
                        
                        </Accordion.ItemBody>
                </Accordion.ItemContent>
                </Accordion.Item>
            </Accordion.Root>
        </Box>
    )
}



export default UserStoryDetailAccordion;