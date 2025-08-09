import { Accordion, Box, IconButton, Input, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import CreateTaskAccordion from "../Tasks/CreateTaskAccordion";
import { Project } from "@/Pages/Projects";
import TaskBox from "../Tasks/TaskBox";
import { toaster } from "../toaster";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

    const navigate = useNavigate();


    useEffect(() => {
      
      setStoryStatus(status);
    },[status])

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
            <Text ml={3} >{storyStatus}</Text> 
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
                                      
                            aria-label="Edit"
                            variant="outline"
                            size="md"
                            onClick={onClickEditName }
                          >
                            {updateStoryName ? "✔" : "✏️"}
                            
                          </IconButton>
                          

                        <Text mt={3}>{storyStatus}</Text> 
                                               
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
                          
                            
                            {tasks.map((task) =>{
                                return <TaskBox task={task}  setStoryStatus={setStoryStatus}/>
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
      </>
  );
}

export default UserStoryDetailAccordion;


// <Box>
  //   <Accordion.Root
  //     collapsible
  //     index={isOpen ? [0] : [1]}
  //     onValueChange={(value: string[]) => setIsOpen(value.length > 0)} // reliable state control
  //     border="1px solid"
  //   >
  //     <Accordion.Item>
  //       <Accordion.ItemTrigger
  //         p={4}
  //         mx={4}
  //         display="flex"
  //         justifyContent="space-between"
  //         _hover={{ cursor: "pointer" }}
  //         w="100%"
  //       >
  //         {updateStoryName ? (
  //           <Input
  //             h="40px"
  //             mr={4}
  //             value={storyName}
  //             onChange={onChange}
  //             type="text"
  //             onClick={(e) => e.stopPropagation()} // prevent closing accordion
  //             onFocus={(e) => e.stopPropagation()} // prevent closing on focus

  //           />
  //         ) : (
  //           <Text flex={1} mt={3}>{name}</Text>
  //         )}

  //         <IconButton
  //           aria-label="Edit"
  //           variant="outline"
  //           size="md"
  //           onClick={(e) => {
  //             e.stopPropagation(); // prevent accordion toggle
  //             updateStoryName
  //               ? updateStory("name", storyName)
  //               : onClickEdit();
  //           }}
  //         >
  //           {updateStoryName ? "✔" : "✏️"}
  //         </IconButton>

  //         <Text >{storyStatus}</Text>

  //         <Accordion.ItemIndicator />
  //       </Accordion.ItemTrigger>

  //       <Accordion.ItemContent>
  //         <Accordion.ItemBody borderTop="1px solid">
  //           <Text ml={8} mt={5}>
  //             <Box pt={4} pb={12}>{description}</Box>
  //             {tasks.map((task) => (
  //               <TaskBox task={task} setStoryStatus={setStoryStatus} />
  //             ))}
  //           </Text>

  //           <CreateTaskAccordion
  //             featureId={featureId}
  //             projectId={projectId}
  //             userStoryId={userStoryId}
  //             setProject={setProject}
  //           />
  //         </Accordion.ItemBody>
  //       </Accordion.ItemContent>
  //     </Accordion.Item>
  //   </Accordion.Root>
  // </Box>