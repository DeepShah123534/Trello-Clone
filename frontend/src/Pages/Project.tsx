import { Box, Text, useDisclosure } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import { Project as ProjectType } from "./Projects";
import CreateFeatureAccordion from "../components/ui/Feature/CreateFeatureAccordion";
import { useState } from "react";
import FeatureModal from "../components/ui/Feature/FeatureModal";
export type Feature = {
    name: string;
    status: "To Do" | "In Progress" | "Done!";
    userStoriesCount: number;
    completedUserStories: number;
    description?: string;
    id: number;
}   

const columns = [
    { name:"To Do" },
    { name:"In Progress" },
    { name: "Done!" }
];


const Project = () => {
    const project = useLoaderData() as ProjectType;

    const [features, setFeatures] = useState(project.features)

    const { open, onOpen, onClose } = useDisclosure();

    const [ selectedFeature, setSelectedFeature ] = useState(features[0]);

    console.log("FEATURES: ", features);
    return (
        <Box m={10} >
            <Box mb={20} >
            <Text mb={4} fontSize={20}>
                {project.name}
            </Text>
            <Text>
                {project.description || "There is no Project Description. "}
            </Text>
            </Box>
            <Box display="flex" gap={10} >
                {columns.map((column) => {
                    return (
                        <Box border="1px solid" flex={1} >
                            <Text textAlign="center" fontSize={20} mt={5}>{column.name}</Text>
                            {features.map ((feature) => {
                                if (column.name === feature.status){
                                    return (
                                    <Box 
                                    border="1px solid" p={4} mx={4} mt={4} 
                                    display="flex"  
                                    justifyContent="space-between"
                                    onClick={() => {
                                        onOpen();
                                        setSelectedFeature(feature);
                                    }}
                                    _hover={{cursor:"pointer"}}
                                    >
                                    <FeatureModal 
                                         open={open} 
                                         onClose={onClose} 
                                         featureName={selectedFeature.name} 
                                         featureDescription={selectedFeature.description || "There is no description..."}
                                         featureId={selectedFeature.id}
                                     />
                                     
                                         <Text mt={5}>{feature.name}</Text>
                                         <Text mt={5}>{feature.completedUserStories} / {feature.userStoriesCount}</Text>
                                         
                                    </Box>
                                    
                                    );
                                } else {
                                    return null;
                                }
                            })}
                            <Box p={4}>
                                {
                                    column.name === "To Do" && 
                                    < CreateFeatureAccordion 
                                    features={features} 
                                    setFeatures={setFeatures}
                                    projectId={project.id}
                                    />
                                }
                            </Box>
                            
                        </Box>
                    );
                })}
            </Box>
            
        </Box>
    );
}

export default Project;