import { Box, Button, IconButton, Input, Text, useDisclosure } from "@chakra-ui/react";
import { useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
import { Project as ProjectType } from "./Projects";
import CreateFeatureAccordion from "../components/ui/Feature/CreateFeatureAccordion";
import { useState } from "react";
import  { UserStory } from "../components/ui/Feature/FeatureModal";
import FeatureBox from "../components/ui/Feature/FeatureBox";
import { toaster } from "../components/ui/toaster";
import axios from "axios";
import DeleteModal from "../components/ui/DeleteModal";
import { Context } from "@/App";


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

    const navigate = useNavigate();
    const context = useOutletContext() as Context;

    const [projectName, setProjectName] = useState(project.name);
    const [projectDescription, setProjectDescription] = useState(project.description);

    const [updateProjectName, setUpdateProjectName] = useState(false);
    const [updateProjectDescription, setUpdateProjectDescription] = useState(false);

    const { open: openDelete, onOpen: onOpenDelete, onClose: onCloseDelete, } = useDisclosure();

    const editName = () => {
        setUpdateProjectName(!updateProjectName);
    }

    const onChangeName = (e: any) => {
        setProjectName(e.target.value);
    };

     const editDescription = () => {
        setUpdateProjectDescription(!updateProjectDescription);
    }

    const onChangeDescription = (e: any) => {
        setProjectDescription(e.target.value);
    };


    const updateProject = (field: "name" | "description", value: string | undefined) => {

        if(projectName === ""){
            toaster.error({
              title: "Error",
              description: "Please enter a valid project name.",
              closable: true,
            });
            setProjectName(project.name);
            return;
        }

        if (
            projectName === project.name &&
            projectDescription === project.description
        ) {
        
            setUpdateProjectName(false);
            setUpdateProjectDescription(false);
            return;

        }

        const token = localStorage.getItem("token");

          axios.post('http://localhost:3000/auth/update-project',
            {
              field,
              value,
              projectId: project.id,
            },
            { headers: { Authorization: `Bearer ${token}`} }
            
          ).then((response) => {
            
            setProject(response.data);
            setUpdateProjectName(false);
            setUpdateProjectDescription(false);

            toaster.success({
                    title: `Your project ${field} updated to successfully`,
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
                    context.toggleLoggedIn();
                    navigate('/log-in')
                } else {
                  toaster.error({
                      title: "Error",
                      description: "There was an error updating the project. Please try again.",
                      closable: true,
                    });
                }
          })
    };

    const deleteProject = () => {
      const token = localStorage.getItem("token");

          axios.post('http://localhost:3000/auth/delete-project',
            {
                projectId: project.id,
            },
            { headers: { Authorization: `Bearer ${token}`} }
          ).then((response) => {
            navigate('/projects')

            toaster.success({
                    title: `Your project deleted successfully`,
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
                    context.toggleLoggedIn();
                    navigate('/log-in')
                } else {
                  toaster.error({
                      title: "Error",
                      description: "There was an error deleting the project. Please try again.",
                      closable: true,
                    });
                }
          })
         
    }

    return (
        <Box m={10} >
            <Box mb={20} display="flex" justifyContent="space-between">
            <Box flex={1}>
            <Box display="flex" mb={4} alignItems="center" gap={3}>
            { updateProjectName ? (
                <Box  width="1000px" flex={1} mr={4} >
                    <Input
                        w="100%"
                        h="40px"
                        value={projectName}
                        onChange={onChangeName}
                        type="text"
                        size="xl"
                        
                      />
                </Box>
            ) : (
            <Text mr={4} fontSize={20}>
                {project.name}
            </Text>
            )
            }    
            <IconButton
                                                                                  
               aria-label="Edit-Name"
               variant="outline"
               size="md"
               onClick={
                updateProjectName ?
                () => {
                    updateProject("name", projectName)
                } :
                editName
               }
             >
               {updateProjectName ? "✔" : "✏️"}
               
             </IconButton>
            </Box>

        <Box display="flex" mb={4} alignItems="center" gap={3}>

            { updateProjectDescription? (
                <Box  width="1000px" flex={1} mr={4} >
                    <Input
                        w="100%"
                        h="40px"
                        value={projectDescription}
                        onChange={onChangeDescription}
                        type="text"
                        size="lg"

                        
                      />
                </Box>
            ) : (
            <Text mr={4} fontSize={20} >
                {project.description || "There is no Project Description. "}
            </Text>
            )

            }
            <IconButton
                                                                                  
               aria-label="Edit-Description"
               variant="outline"
               size="md"
               onClick={
                updateProjectDescription?
                () => {
                    updateProject("description", projectDescription)
                } :
                editDescription
               }
             >
               {updateProjectDescription ? "✔" : "✏️"}
               
             </IconButton>

        </Box>

        </Box>

        <Button onClick={onOpenDelete}>Delete Project</Button>
          
        </Box>
        
            <Box display="flex" gap={10}  alignItems="flex-start">
                {columns.map((column) => {
                    return (
                        <Box border="1px solid" flex={1} key={column.name} alignSelf="flex-start">
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
            <DeleteModal 
            isOpen={openDelete}
            onClose={onCloseDelete}
            itemType="project"
            deleteItem={deleteProject} />
        </Box>
    );
}

export default Project;