import { Accordion, Span, Box, Input, Button } from "@chakra-ui/react";
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control';
import { useState } from "react";

import axios from "axios";
import { toaster } from "../toaster";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Project } from "@/Pages/Projects";
import { Context } from "@/App";

type Props = {
  featureId: number;
  projectId: number;
  userStoryId: number;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
} 

const CreateTaskAccordion = ({ featureId, projectId, userStoryId, setProject } : Props) => {
  console.log('PROJECT ID', projectId)
  console.log('FEATURE ID', featureId)
  console.log('USER STORY ID', userStoryId)

  const [name, setName] = useState(""); 
  const navigate = useNavigate();

  const [submitClickedName, setSubmitClickedName] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const isErrorName = name === "" && submitClickedName;

  const context = useOutletContext() as Context;

    const onchangeName = (e: any) => {
        setSubmitClickedName(false);
        setName(e.target.value);
    };


    const onSubmit = () => {

        setSubmitClickedName(true);
        if (name.trim() !== '') {
          setIsOpen(false);
          console.log('NAME', name)
          const token = localStorage.getItem("token");

          if (!token) {
            toaster.error({
              title: "Not Authenticated",
              description: "Please log in again.",
            });
            navigate('/log-in');
            return;
          }

          axios.post('http://localhost:3000/auth/create-task',
            {
              name,
              projectId,
              featureId,
              userStoryId
            },
            { headers: { Authorization: `Bearer ${token}`} }
          ).then((response) => {
            console.log("PROJECT", response.data);
            setProject(response.data)
              toaster.success({
                title: "Your developer task created successfully",
                type: "success", // 👈 "type" determines color/indicator
                closable: true,
             })
            setName("");
            setSubmitClickedName(false);
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
                  description: "There was an error creating developer task try again.",
                  closable: true,
                });
            }
          })

        }
    };

  return (
    <Accordion.Root collapsible index={isOpen ? [0] : [1]}   borderTop="1px solid" >
      <Accordion.Item >
        <Accordion.ItemTrigger onClick={() => setIsOpen(false)} >
          <Box display="flex" justifyContent="space-between" alignItems="center" w="100%" pl={8}  onClick={() => setIsOpen(!isOpen)} >
            <Span>Add Task</Span>
            <Accordion.ItemIndicator />
          </Box>
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody borderTop="1px solid" pb={4}>
            <FormControl pl={10} isInvalid={isErrorName} isRequired mb={2}>
                <FormLabel>Task Name:</FormLabel>
                <Input type="text" value={name} onChange={onchangeName} />
                {!isErrorName ? null : (
                    <FormErrorMessage>Task Name is required</FormErrorMessage>
                )}
            </FormControl>
            <Button width="99%" ml={2} onClick={onSubmit}>
                Create Task
            </Button>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

    </Accordion.Root>
  );
};

export default CreateTaskAccordion;  