import { Box, Text } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import { Project as ProjectType } from "./Projects";
import CreateFeatureAccordion from "../components/ui/Feature/CreateFeatureAccordion";
import { useState } from "react";
import  { UserStory } from "../components/ui/Feature/FeatureModal";
import FeatureBox from "../components/ui/Feature/FeatureBox";


export type Feature = {
    name: string;
    status: "To Do" | "In Progress" | "Done!";
    userStoriesCount: number;
    completedUserStories: number;
    description?: string;
    id: number;
    userStories: UserStory[];
}   

const columns = [
    { name:"To Do" },
    { name:"In Progress" },
    { name: "Done!" }
];


const Project = () => {
    const loaderData = useLoaderData() as ProjectType;

    const [project, setProject] = useState(loaderData)

    console.log("Project: ", project);

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
                        <Box border="1px solid" flex={1} key={column.name}>
                            <Text textAlign="center" fontSize={20} mt={5}>{column.name}</Text>
                            {project.features.map  ((feature) => {
                                if (column.name === feature.status){
                                    return (
                                    <FeatureBox 
                                    key={feature.id}
                                     feature={feature} 
                                     projectId={project.id} 
                                     setProject={setProject}/>
                                    
                                    );
                                } else {
                                    return null;
                                }
                            })}
                            <Box p={4}>
                                {
                                    column.name === "To Do" && 
                                    < CreateFeatureAccordion 
                                    features={project.features} 
                                    setProject={setProject}
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