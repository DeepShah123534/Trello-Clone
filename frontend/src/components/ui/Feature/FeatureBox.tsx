import { Feature } from "@/Pages/Project";
import { Box, Text, useDisclosure } from "@chakra-ui/react";
import FeatureModal from "./FeatureModal";
import { Project } from "@/Pages/Projects";
import axios from "axios";
import { toaster } from "../toaster";
import { useNavigate } from "react-router-dom";

type Props = {
    feature: Feature;
    projectId: number;
    setProject: React.Dispatch<React.SetStateAction<Project>>;
};

const FeatureBox = ({feature, projectId ,setProject } : Props) => {

   const { open, onOpen, onClose } = useDisclosure();
   const navigate = useNavigate();

   const onCloseModal = () => {

    const token = localStorage.getItem("token");
     axios.get(`http://localhost:3000/auth/project/${projectId}`,
              { headers: { Authorization: `Bearer ${token}`} 
            }).then((response) => {
                setProject(response.data);
                onClose();
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
                          description: "There was an error updating the task. Please try again.",
                          closable: true,
                        });
                    }
                })
   }

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
         <Text mt={5}>{feature.completedUserStories}/{feature.userStoriesCount}</Text>
             
        </Box>
        <FeatureModal
            open={open}
            onClose={onCloseModal}
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