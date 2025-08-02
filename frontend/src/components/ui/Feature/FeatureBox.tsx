import { Feature } from "@/Pages/Project";
import { Box, Text, useDisclosure } from "@chakra-ui/react";
import FeatureModal from "./FeatureModal";
import { Project } from "@/Pages/Projects";

type Props = {
    feature: Feature;
    projectId: number;
    setProject: React.Dispatch<React.SetStateAction<Project>>;
};

const FeatureBox = ({feature, projectId ,setProject } : Props) => {

    const { open, onOpen, onClose } = useDisclosure();
   return (
    <>
        <Box 
        border="1px solid" p={4} mx={4} mt={4} 
        display="flex"  
        justifyContent="space-between"
        onClick={onOpen}
        _hover={{cursor:"pointer"}}
        key={feature.id}
        >
         
             <Text mt={5}>{feature.name}</Text>
             <Text mt={5}>{feature.completedUserStories} / {feature.userStoriesCount}</Text>
             
        </Box>
        <FeatureModal
            open={open}
            onClose={onClose}
            featureName={feature.name}
            featureDescription={
            feature.description || "There is no description..."
            }
            featureId={feature.id}
            projectId={projectId}
            stories={feature.userStories}
            setProject={setProject}
        />
    </>
        
        );
}

export default FeatureBox;