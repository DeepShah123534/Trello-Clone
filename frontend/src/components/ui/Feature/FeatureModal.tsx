import { Box, Text, CloseButton, Dialog, Portal, Input, IconButton, Button, useDisclosure } from "@chakra-ui/react"
import UserStoryDetailAccordion, { Task } from "../UserStories/UserStoryDetailAccordion";
import CreateUserStoryAccordion from "../UserStories/CreateUserStoryAccordion";
import { Project } from "@/Pages/Projects";
import { useState } from "react";
import { toaster } from "../toaster";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../DeleteModal";


type Props = {
    open: boolean;
    onClose:  () => void;
    featureName: string;
    featureDescription: string;
    featureId: number;
    projectId: number;
    stories: UserStory[]; 
    setProject: React.Dispatch<React.SetStateAction<Project>>
}

export type UserStory = {
    name: string;
    description: string;
    id: number;
    tasks: Task[];
    completedTask: number;
    taskCount: number;
}


const FeatureModal = ({ open, onClose, featureName, featureDescription, featureId, projectId, stories, setProject}: Props) => {
    const [updateFeatureName, setUpdateFeatureName] = useState(false);

    const [name, setName] = useState(featureName);

    const editName = () => {
        setUpdateFeatureName(!updateFeatureName);
    }

    const editDescription = () => {
        setUpdateFeatureDescription(!updateFeatureDescription);
    }

    const [description, setDescription] = useState(featureDescription);
    const [updateFeatureDescription, setUpdateFeatureDescription] = useState(false);

    const { open: openDelete, onOpen: onOpenDelete, onClose: onCloseDelete, } = useDisclosure();

    const navigate = useNavigate();

    const onChangeName = (e: any) => {
        setName(e.target.value);
    };

    const onChangeDescription = (e: any) => {
        setDescription(e.target.value);
    };

    const updateFeature = (field: "name" | "description", value: string ) => {

        if(name === ""){
            toaster.error({
              title: "Error",
              description: "Please enter a valid feature name.",
              closable: true,
            });
            setName(featureName);
            return;
        }


        const token = localStorage.getItem("token");

          axios.post('http://localhost:3000/auth/update-feature',
            {
              field,
              value,
              featureId,
            },
            { headers: { Authorization: `Bearer ${token}`} }
            
          ).then((response) => {
            
            setProject(response.data);
            setUpdateFeatureName(false);
            setUpdateFeatureDescription(false);

            toaster.success({
                    title: `Your feature ${field} updated to successfully`,
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
                      description: "There was an error updating the feature. Please try again.",
                      closable: true,
                    });
                }
          })
    };

    const deleteFeature = () => {
      const token = localStorage.getItem("token");

          axios.post('http://localhost:3000/auth/delete-feature',
            {
              featureId,
            },
            { headers: { Authorization: `Bearer ${token}`} }
          ).then((response) => {
      
            setProject(response.data);

            toaster.success({
                    title: `Your feature deleted successfully`,
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
                      description: "There was an error deleting the feature. Please try again.",
                      closable: true,
                    });
                }
          })
         
    }

    return (
     
            <Dialog.Root 
            size="xl" 
            placement="center" 
            motionPreset="slide-in-bottom" 
            modal 
            open={open} 
            onClose={onClose}
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                    <Dialog.Content minW="75%" minH="75%" justifyContent="space-between"> 
                        <Dialog.Header>
                        <Dialog.Title>
                            <Box mb={20} >
                                <Box display="flex" mb={4} alignItems="center" gap={3}>
                            {   
                                updateFeatureName ? (
                                    <Box  width="1000px" >
                                        <Input
                                            w="100%"
                                            h="40px"
                                            value={name}
                                            onChange={onChangeName}
                                            type="text"
                                            size="xl"
                                            
                                          />
                                    </Box>
                                    ) :
                                    ( 
                                    <Text fontSize={20}>
                                     {featureName}
                                    </Text>
                                    )
                            }
                                <IconButton
                                                                      
                                   aria-label="Edit-Name"
                                   variant="outline"
                                   size="md"
                                   onClick={
                                    updateFeatureName ?
                                    () => {
                                        updateFeature("name", name)
                                    } :
                                    editName
                                   }
                                 >
                                   {updateFeatureName ? "✔" : "✏️"}
                                   
                                 </IconButton>

                                </Box>

                                <Box display="flex" mb={4} alignItems="center" justifyContent="space-between" gap={5}>
                                    { updateFeatureDescription ? 
                                (
                                    <Box  width="1000px">
                                        <Input
                                           
                                            h="40px"
                                            value={description}
                                            onChange={onChangeDescription}
                                            type="text"
                                            size="lg"
                                            
                                            
                                          />
                                    </Box>
                                ) : (
                                <Text>
                                    {featureDescription}
                                </Text>
                                )}    
                                <IconButton
                                   mr={4}                          
                                   aria-label="Edit-Description"
                                   variant="outline"
                                   size="md"
                                   onClick={
                                    updateFeatureDescription ?
                                    () => {
                                        updateFeature("description", description)
                                    } :
                                    editDescription
                                   }
                                 >
                                   {updateFeatureDescription ? "✔" : "✏️"}
                                   
                                 </IconButton>

                                </Box>
                                    
                            </Box>
                        </Dialog.Title>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" onClick={onClose} />
                        </Dialog.CloseTrigger>
                        </Dialog.Header>
                        <Dialog.Body >
                            <Box display="flex" flexDirection="column" gap={5} >
                            {stories.map((story) => {
                                return (
                                 <UserStoryDetailAccordion 
                                    name={`${story.name}`}
                                    status={`${story.completedTask}/${story.taskCount}`}
                                    description={`${story.description}`}
                                    featureId={featureId}
                                    projectId={projectId}
                                    userStoryId={story.id}
                                    tasks={story.tasks}
                                    key={story.id}
                                    setProject={setProject}
                                 />
                                )
                            })}
                            <CreateUserStoryAccordion 
                            featureId={featureId}
                            projectId={projectId}
                            setProject={setProject}
                            />
                            
                            
                            </Box>
                            
                           
                            
                            
                        </Dialog.Body>
                         <Button m={10} onClick={onOpenDelete}>Delete Feature</Button>
                          <DeleteModal 
                              isOpen={openDelete}
                              onClose={onCloseDelete}
                              itemType="feature"
                              deleteItem={deleteFeature}
                          />
                    </Dialog.Content>
                   
                    </Dialog.Positioner>
                </Portal>  
            </Dialog.Root>
        
  )
}

export default FeatureModal;