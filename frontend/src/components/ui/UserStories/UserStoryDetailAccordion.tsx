import { Accordion, Box, Button, Text } from "@chakra-ui/react"
import { useState } from "react";
import CreateTaskAccordion from "../Tasks/CreateTaskAccordion";
import { Project } from "@/Pages/Projects";

type Props = {
    name: string;
    status: string;
    description: string;
    projectId: number;
    featureId: number;
    userStoryId: number;
    tasks: Task[];
    setProject: React.Dispatch<React.SetStateAction<Project>>
}

export type Task = {
    name: string;
    status: string;
}

const UserStoryDetailAccordion = ( {name, status, 
    description, projectId, 
    featureId, userStoryId,
    tasks, setProject
    }: Props ) => {

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
                        <Text ml={8} mt={5} >
                            <Box pt={4} pb={12}>
                                {description}
                            </Box>
                            {tasks.map((task) =>{
                                return(
                                    <Box 
                                    display="flex" 
                                    justifyContent="space-between" 
                                    borderTop="1px solid" 
                                    alignItems="center" 
                                    px={4} py={2} 
                                    key={task.name}>
                                        <Text> {task.name}</Text>
                                        <Button mt={2} mr={4}>{task.status}</Button>
                                    </Box>
                                )
                            })}
                        </Text>
                        <CreateTaskAccordion  
                        featureId={featureId} 
                        projectId={projectId} 
                        userStoryId={userStoryId}
                        setProject={setProject}
                        />
                        </Accordion.ItemBody>
                </Accordion.ItemContent>
                </Accordion.Item>
            </Accordion.Root>
        </Box>
    )
}



export default UserStoryDetailAccordion;