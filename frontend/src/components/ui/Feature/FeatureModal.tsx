import { Box, Text, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import UserStoryDetailAccordion, { Task } from "../UserStories/UserStoryDetailAccordion";
import CreateUserStoryAccordion from "../UserStories/CreateUserStoryAccordion";
import { useEffect, useState } from "react";
import { Project } from "@/Pages/Projects";


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
    console.log('STORIES: ', stories)
    return (
     
            <Dialog.Root 
            size="xl" 
            placement="center" 
            motionPreset="slide-in-bottom" 
            modal 
            open={open} 
            onClose={onClose}>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                    <Dialog.Content minW="75%" minH="75%"> 
                        <Dialog.Header>
                        <Dialog.Title>
                            <Box mb={20} >
                                <Text mb={4} fontSize={20}>
                                     {featureName}
                                </Text>

                                <Text>
                                    {featureDescription}
                                </Text>
                            </Box>
                        </Dialog.Title>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" onClick={onClose} />
                        </Dialog.CloseTrigger>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Box display="flex" flexDirection="column" gap={5}>
                            {stories.map((story) => {
                                return (
                                 <UserStoryDetailAccordion 
                                    name={`${story.name}`}
                                    status={`${story.completedTask} / ${story.taskCount}`}
                                    description={`${story.description}`}
                                    featureId={featureId}
                                    projectId={projectId}
                                    userStoryId={story.id}
                                    tasks={story.tasks}
                                    key={story.id}
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
                    </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>  
            </Dialog.Root>
        
  )
}

export default FeatureModal;