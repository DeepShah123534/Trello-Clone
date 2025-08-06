import { Box, Button, Text, IconButton, Input } from "@chakra-ui/react";
import { Task } from "../UserStories/UserStoryDetailAccordion";
import { useState } from "react";
import axios from "axios";
import { toaster } from "../toaster";
import { useNavigate } from "react-router-dom";
import { Project } from "@/Pages/Projects";

type Props = {
    task:  Task;
    setProject: React.Dispatch<React.SetStateAction<Project>>
} 


const TaskBox = ({ task, setProject }: Props) => {

    const [taskStatus, setTaskStatus] = useState(task.status);

    const [updateName, setUpdateName] = useState(false);

    const [taskName, setTaksName] = useState(task.name);

  const onChange = (e: any) => {
    setTaksName(e.target.value);
  };

  const onClickEdit = () => {
    setUpdateName(!updateName);
  };


    const navigate = useNavigate();

    const updateTask = (field: "status" | "name", value: string ) => {
        // console.log('FIELD: ', field)
        // console.log('VALUE: ', value)

        if(taskName === ""){
            toaster.error({
                      title: "Error",
                      description: "Please enter a valid task name.",
                      closable: true,
                    });
            setTaksName(task.name);
            return;
        }


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
            setProject(response.data);
            setUpdateName(false);

            toaster.success({
                    title: `Your task ${field} updated to successfully`,
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
        gap={5}
        key={task.name}>
            <Box flex={1}>
            {updateName ? (
                <Input
                  
                  h="32px"
                  value={taskName}
                  onChange={onChange}
                  type="text"
                />
              ) : (
                <Text flex={1}> {task.name}</Text>
              )}
              </Box>
              <IconButton
              
                aria-label="Edit"
                variant="outline"
                size="md"
                onClick={updateName ? 
                    () => { updateTask ("name", taskName)} 
                    : onClickEdit}
              >
                {updateName ? "✔" : "✏️"}
              </IconButton>
            
            <Button 
            w="118px"
            onClick={toggleTaskStatus}
            >
                {taskStatus}
                
            </Button>
        </Box>
    )
}

export default TaskBox;