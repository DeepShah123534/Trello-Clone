import { Box, Button, Text } from "@chakra-ui/react";
import { Task } from "../UserStories/UserStoryDetailAccordion";
import { useState } from "react";
import axios from "axios";
import { toaster } from "../toaster";
import { useNavigate } from "react-router-dom";

type Props = {
    task:  Task;
} 


const TaskBox = ({ task }: Props) => {

    const [taskStatus, setTaskStatus] = useState(task.status);

    const navigate = useNavigate();

    const updateTask = (field: "status" | "name", value: string ) => {
        // console.log('FIELD: ', field)
        // console.log('VALUE: ', value)


        const token = localStorage.getItem("token");

          axios.post('http://localhost:3000/auth/update-task',
            {
              field,
              value,
              taskId: task.id,
            },
            { headers: { Authorization: `Bearer ${token}`} }
          ).then((response) => {
            console.log("Task Updated: ", response.data);
            toaster.success({
                    title: `Your task ${field} updated to successfully`,
                    type: "success", // 👈 "type" determines color/indicator
                    closable: true,
                })
            
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
    };

    const updateTaskStatus = (status: 'To Do' | 'In Progress' | 'Done!') => {
        setTaskStatus(status);
    }

    const toggleTaskStatus = () => {
        
        if(taskStatus === "To Do") {
            setTaskStatus("In Progress");
            updateTask("status", "In Progress");    
        } else if(taskStatus === "In Progress") {
            setTaskStatus("Done!");
            updateTask("status", "Done!")
        } else {
            setTaskStatus("To Do");
            updateTask("status", "To Do")
        }
       
    };


    return (

        <Box 
        display="flex" 
        justifyContent="space-between" 
        borderTop="1px solid" 
        alignItems="center" 
        px={4} py={2} 
        key={task.name}>
            <Text> {task.name}</Text>
            <Button 
            mt={2} mr={4}
            onClick={toggleTaskStatus}
            >
                {taskStatus}
                
            </Button>
        </Box>
    )
}

export default TaskBox;