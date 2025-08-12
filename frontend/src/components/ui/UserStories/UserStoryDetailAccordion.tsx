import { Accordion, Box, Button, IconButton, Input, Text, useDisclosure } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import CreateTaskAccordion from "../Tasks/CreateTaskAccordion";
import { Project } from "@/Pages/Projects";
import TaskBox from "../Tasks/TaskBox";
import { toaster } from "../toaster";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../DeleteModal";



type Props = {
    name: string;
    status: string;
    description: string;
    projectId: number;
    featureId: number;
    userStoryId: number;
    tasks: Task[];
    setProject: React.Dispatch<React.SetStateAction<Project>>;
}


export type Task = {
    name: string;
    status: string;
    id: number;
}

const UserStoryDetailAccordion = ( {name, status, 
    description, projectId, 
    featureId, userStoryId,
    tasks, setProject
    }: Props ) => {
    const [storyStatus, setStoryStatus] = useState(status);
    const [updateStoryName, setUpdateStoryName] = useState(false);
    const [storyName, setStoryName] = useState(name)
    const [updateStoryDescription, setUpdateStoryDescription] = useState(false);

    const [storyDescription, setStoryDescription] = useState(description);
    
    const [isOpen, setIsOpen] = useState(false);

    const { open, onOpen, onClose } = useDisclosure();  
    const [taskList, setTaskList] = useState(tasks)

    

    const navigate = useNavigate();


    useEffect(() => {
      
      setStoryStatus(status);
      setTaskList(tasks)
    },[status, tasks])

    const onChangeName = (e: any) => {
        setStoryName(e.target.value);
    };

    const onChangeDescription = (e: any) => {
        setStoryDescription(e.target.value);
    };

    const onClickEditName = () => {
        setUpdateStoryName(!updateStoryName);
    };

    const onClickEditDescription = () => {
        setUpdateStoryDescription(!updateStoryDescription);
    };

    const updateStory = (field: "name" | "description", value: string ) => {

        if(storyName === ""){
            toaster.error({
              title: "Error",
              description: "Please enter a valid user story name.",
              closable: true,
            });
            setStoryName(name);
            return;
        }


        const token = localStorage.getItem("token");

          axios.post('http://localhost:3000/auth/update-user-story',
            {
              field,
              value,
              userStoryId,
            },
            { headers: { Authorization: `Bearer ${token}`} }
            
          ).then((response) => {
            
            setProject(response.data);
            setUpdateStoryName(false);
            setUpdateStoryDescription(false);

            toaster.success({
                    title: `Your user story ${field} updated to successfully`,
                    type: "success", 
                    closable: true,
                })
            
          }).catch ((error) => {


                if (error.response.data.message === 'Unauthorized') {
                    toaster.error({
                      title: "Error",
                      description: "Your session has expired log in again.",
                      closable: true,
                    });
                
                    navigate('/log-in')
                } else {
                  toaster.error({
                      title: "Error",
                      description: "There was an error updating the user story. Please try again.",
                      closable: true,
                    });
                }
          })
    };

    const deleteStory = () => {
      const token = localStorage.getItem("token");

          axios.post('http://localhost:3000/auth/delete-user-story',
            {
              userStoryId,
            },
            { headers: { Authorization: `Bearer ${token}`} }
          ).then((response) => {
            setProject(response.data);

           

            toaster.success({
                    title: `Your user story deleted successfully`,
                    type: "success", 
                    closable: true,
                })
            
          }).catch ((error) => {


                if (error.response.data.message === 'Unauthorized') {
                    toaster.error({
                      title: "Error",
                      description: "Your session has expired log in again.",
                      closable: true,
                    });
                
                    navigate('/log-in')
                } else {
                  toaster.error({
                      title: "Error",
                      description: "There was an error deleting the user story. Please try again.",
                      closable: true,
                    });
                }
          })
         
    }

   return (
   <>
   {updateStoryName ?  
      <Box border="1px solid" display="flex" p={4} gap={4} alignItems="center" >
        <Box flex={1} >
        <Input
            mr={4}
            h="40px"
            value={storyName}
            onChange={onChangeName}
            type="text"
            
          />
        </Box>

            <IconButton
                          
                aria-label="Edit"
                variant="outline"
                size="md"
                onClick={ 
                    () => { 
                        updateStory("name", storyName) 
                    } 
                     }
              >
                {updateStoryName ? "✔" : "✏️"}
                  
            </IconButton>
            <Text mr={4} >{storyStatus}</Text> 
            <Button variant="outline"  onClick={onOpen}  mr={4}> Delete </Button>
      </Box>:
        <Box >
            <Accordion.Root collapsible index={isOpen ? [0] : [1]} border="1px solid"  >
                <Accordion.Item >
                <Accordion.ItemTrigger  onClick={() => setIsOpen(false)}  p={4} mx={4} 
                      display="flex"
                      justifyContent="space-between"
                        _hover={{cursor:"pointer"}}
                        w="100%">

                        <Text flex={1} >{name}</Text>
                        
                        <IconButton
                            mr={2}
                            aria-label="Edit"
                            variant="outline"
                            size="md"
                            onClick={onClickEditName }
                          >
                            {updateStoryName ? "✔" : "✏️"}
                            
                          </IconButton>
                          

                        <Text mr={2}>{storyStatus}</Text> 

                        <Button variant="outline"  onClick={onOpen}  mr={4}> Delete </Button>
                                               
                    <Accordion.ItemIndicator /> 
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                    <Accordion.ItemBody borderTop="1px solid" >
                        <Text ml={8} mt={5} >
                                    
                          <Box display="flex" >
                            { updateStoryDescription ?  
                            (
                              <Box flex={1} >
                                <Input
                                    mr={4}
                                    gap={4}
                                    h="40px"
                                    value={storyDescription}
                                    onChange={onChangeDescription}
                                    type="text"

                                  />
                                </Box>
                            ) : 
                            ( <Box  pb={12} flex={1}>
                                {description}
                            </Box>)}
                            <Box ml={10} display="flex"  >
                              <IconButton
                             
                            aria-label="Edit"
                            variant="outline"
                            size="md"
                            onClick={
                              updateStoryDescription ? () =>{ updateStory("description", storyDescription) } 
                            : onClickEditDescription }
                            
                          >
                            {updateStoryDescription ? "✔" : "✏️"}
                            
                          </IconButton>
                            </Box>
                          </Box>
                          
                            
                            {taskList.map((task) =>{
                                return <TaskBox  task={task}  setStoryStatus={setStoryStatus} setTaskList={setTaskList}/>
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
      }
      <DeleteModal isOpen={open} onClose={onClose} deleteItem={deleteStory} itemType={"user story"}/>
      </>
  );
}

export default UserStoryDetailAccordion;

