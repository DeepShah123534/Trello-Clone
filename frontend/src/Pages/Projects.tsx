// import { Box, Text } from "@chakra-ui/react";
// import { useLoaderData, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import CreateProjectAccordion from "../components/ui/Projects/CreateProjectAccordion";

// interface Project {
//   id: string;
//   name: string;
//   description: string;
//   status: string;
// }

// interface User {
//   name: string;
//   projects: Project[];
// }

// const Projects = () => {
//   const data = useLoaderData() as User;

// const navigate = useNavigate();
// const [projects, setProjects] = useState<Project[]>(data?.projects ?? []);


// if (!data) {
//   return <Text textAlign="center">Loading or no data available...</Text>;
// }

// const goToProject = (projectId: string) => {
//   navigate(`/project/${projectId}`);
// };

//   return (
//     <Box maxW="1000px" mx="auto" px={6}>
      
//       <Text textAlign="center" mb={4} fontSize={20}>
//         {data.name}'s Projects
//       </Text>

//       <Box mb={10}>
//         {projects.map((project) => (
//           <Box
//             key={project.id}
//             display="flex"
//             border="1px solid"
//             borderColor="gray.300"
//             p={4}
//             mb={4}
//             borderRadius="md"
//             onClick={() => goToProject(project.id)}
//             _hover={{ bg: "gray.100", cursor: "pointer" }}
//           >
//             <Text w="20%" fontWeight="semibold">
//               {project.name}
//             </Text>
//             <Text flex={1}>{project.description}</Text>
//             <Text w="15%" ml={6} color="gray.600">
//               {project.status}
//             </Text>
//           </Box>
//         ))}
//       </Box>

//       <CreateProjectAccordion projects={projects} setProjects={setProjects} />
//     </Box>
//   );
// };

// export default Projects;

import { Box } from "@chakra-ui/react";

const Projects = () => {
    return  <Box>Projects Page</Box>
};  

export default Projects;