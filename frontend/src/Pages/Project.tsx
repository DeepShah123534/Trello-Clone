import { Box } from "@chakra-ui/react"
import { useParams } from "react-router-dom";

const Project = () => {
    const { id } = useParams();
    console.log("Project ID:", id);
    return (
        <Box>
            Project Page number
        </Box>
    )
}

export default Project;