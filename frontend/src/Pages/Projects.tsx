import { Box, Text } from "@chakra-ui/react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Data } from "./Profile";
import CreateProjectAccordion from '../components/ui/Projects/CreateProjectAccordion';
import { useState } from "react";

export type Project = {
    id: number;
    name: string;
    description?: string;
    status: string;

}

type LoaderData = {
  user:Data;
  projects:Project[];

}

const Projects = () => {
  const navigate = useNavigate();
  const data = useLoaderData() as LoaderData;
  const user = data.user as Data;

  const[projects, setProjects] = useState(data.projects);

  console.log(data.projects)

  const goToProject = (id: number) => {
    navigate( `/project/${id}`)
  }

  return (
    <Box>
      <Text textAlign="center" mb={4} fontSize={20}>
        {user.name}'s Projects
      </Text>
      <Box m={10} >
        {projects.map((project) => {
          return (
            <Box display="flex" border="1px solid"  p={4} mb={6} onClick={() => {goToProject(project.id)}} _hover={{ cursor: "pointer", backgroundColor: "grey" }}>
              <Text w="15%">{project.name}</Text>
              <Text lineClamp="2" flex={3}>{project.description}</Text>
              <Text w="15%" ml={10}>{project.status}</Text>
            </Box>
          )
        })}
         <CreateProjectAccordion projects={projects} setProjects={setProjects} />
       </Box>  
    </Box>
  );
};



export default Projects;