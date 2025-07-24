import { Box, Text, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import UserStoryDetailAccordion from "../UserStories/UserStoryDetailAccordion";


type Props = {
    open: boolean;
    onClose:  () => void;
    featureName: string;
    featureDescription: string;
}

const sampleUserStories = [
    { name: "User Story", description:"This is User Story description", status:"3/6", },
    { name: "User Story", description:"This is User Story description", status:"4/10", },
    { name: "User Story", description:"This is User Story description", status:"1/4", },
    { name: "User Story", description:"This is User Story description", status:"2/7", },
    { name: "User Story", description:"This is User Story description", status:"6/13", },
] 

const FeatureModal = ({ open, onClose, featureName, featureDescription }: Props) => {
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
                            {sampleUserStories.map((story, index) => {
                                return (

                                         <UserStoryDetailAccordion 
                                            name={`${story.name} ${index + 1}`}
                                            status={story.status}
                                            description={`${story.description} ${index + 1}`}
                                         />
                                )
                            })}
                            </Box>
                        </Dialog.Body>
                    </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>  
            </Dialog.Root>
        
  )
}

export default FeatureModal;