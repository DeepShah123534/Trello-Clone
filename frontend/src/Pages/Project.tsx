import { Box, Text } from "@chakra-ui/react"
import { useLoaderData } from "react-router-dom";
import { Project as ProjectType } from "./Projects";
import CreateFeatureAccordion from "../components/ui/Projects/CreateFeatureAccordion";
import { useState } from "react";

export type Feature = {
    name: string;
    status: "To Do" | "In Progress" | "Done!";
    userStoriesCount: number;
    completedUserStories: number;
}

const columns = [
    {
        name:"To Do"
    },
    {
        name:"In Progress"
    },
    {
        name: "Done!"
    }
];

const sampleFeatures: Feature[] =[
    {
        name:"Feature 1",
        status:"To Do",
        userStoriesCount: 10,
        completedUserStories: 0,
    },
    {
        name:"Feature 2",
        status:"To Do",
        userStoriesCount: 10,
        completedUserStories: 0,
    },
    {
        name:"Feature 3",
        status:"In Progress",
        userStoriesCount: 10,
        completedUserStories: 3,
    },
    {
        name:"Feature 4",
        status:"Done!",
        userStoriesCount: 10,
        completedUserStories: 10,
    },
    {
        name:"Feature 5",
        status:"In Progress",
        userStoriesCount: 10,
        completedUserStories: 5,
    },
    {
        name:"Feature 6",
        status:"Done!",
        userStoriesCount: 10,
        completedUserStories: 10,
    },
    {
        name:"Feature 7",
        status:"To Do",
        userStoriesCount: 15,
        completedUserStories: 0,
    },{
        name:"Feature 8",
        status:"To Do",
        userStoriesCount: 8,
        completedUserStories: 0,
    },
]

const Project = () => {
    const project = useLoaderData() as ProjectType;

    const [features, setFeatures] = useState(project.features)

    console.log("FEATURES: ", features);
    return (
        <Box m={10}>
            <Box mb={20}>
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
                                    <Box border="1px solid" p={4} mx={4} mt={4} display="flex"  justifyContent="space-between">
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