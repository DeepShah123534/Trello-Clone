import { Box, Text, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import UserStoryDetailAccordion, { Task } from "../UserStories/UserStoryDetailAccordion";
import CreateUserStoryAccordion from "../UserStories/CreateUserStoryAccordion";
import { useEffect, useState } from "react";


type Props = {
    open: boolean;
    onClose:  () => void;
    featureName: string;
    featureDescription: string;
    featureId: number;
    projectId: number;
    stories: UserStory[];
}

export type UserStory = {
    name: string;
    description: string;
    status: string;
    id: number;
    tasks: Task[];
}


const FeatureModal = ({ open, onClose, featureName, featureDescription, featureId, projectId, stories, }: Props) => {
        const [userStories, setUserStories] = useState(stories);
        useEffect(() => {
            setUserStories(stories)
        }, [stories])

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
                                    Feature {featureName}
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
                            {userStories.map((story, index) => {
                                return (
                                 <UserStoryDetailAccordion 
                                    name={`${story.name}`}
                                    status={story.status}
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
                            userStories={userStories} 
                            setUserStories={setUserStories}
                            featureId={featureId}
                            projectId={projectId}
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