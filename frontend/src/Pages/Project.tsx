import { Box } from "@chakra-ui/react"
import { useLoaderData, useParams } from "react-router-dom";

const Project = () => {
    // const { id } = useParams();
    const data = useLoaderData();
    console.log("DATA:", data);
    return (
        <Box>
            Project Page number
        </Box>
    )
}

export default Project;