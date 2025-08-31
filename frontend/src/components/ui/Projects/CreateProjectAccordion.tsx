import { Accordion, Span, Box, Input, Textarea, Button } from "@chakra-ui/react";
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control';
import { useState } from "react";
import { Project } from "@/Pages/Projects";
import axios from "axios";
import { toaster } from "../toaster";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Context } from "@/App";

type Props = {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
} 

const CreateProjectAccordion = ({ projects, setProjects} : Props) => {

  const [name, setName] = useState(""); 
  const [description, setDescription] = useState(""); 

  const [submitClickedName, setSubmitClickedName] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const context = useOutletContext() as Context;

  const isErrorName = name === "" && submitClickedName;

    const onchangeName = (e: any) => {
        setSubmitClickedName(false);
        setName(e.target.value);
    };

    const onChangeDescription = (e: any) => {
        setDescription(e.target.value);
    };

    const onSubmit = () => {

        setSubmitClickedName(true);
        if (name !== ' ') {
          setIsOpen(false);

          const token = localStorage.getItem("token");
          axios.post('http://localhost:3000/auth/create-projects',
            {
              name,
              description,
            
            },
            { headers: { Authorization: `Bearer ${token}`} }
          ).then((response) => {
            console.log("Project created successfully", response.data);
            setProjects (response.data);
            setName("");
            setDescription("");
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
                    description: "Your session has expired log in again.",
                    closable: true,
                  });
              }
          })

        }
    };

  return (
    <Accordion.Root collapsible index={isOpen ? [0] : [1]}   border="1px solid" borderColor="gray.300" borderRadius="md">
      <Accordion.Item >
        <Accordion.ItemTrigger onClick={() => setIsOpen(false)} >
          <Box display="flex" justifyContent="space-between" alignItems="center" w="100%" px={4}  onClick={() => setIsOpen(!isOpen)} >
            <Span>Add Project</Span>
            <Accordion.ItemIndicator />
          </Box>
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody borderTop="1px solid" pb={4}>
            <FormControl pl={10} pr={8} isInvalid={isErrorName} isRequired mb={2}>
                <FormLabel>Project Name:</FormLabel>
                <Input type="text" value={name} onChange={onchangeName} />
                {!isErrorName ? null : (
                    <FormErrorMessage>Project Name is required</FormErrorMessage>
                )}
            </FormControl>
            <FormControl pl={10} pr={8} mb={4}>
                <FormLabel>Project Description:</FormLabel>
                <Textarea  value={description} onChange={onChangeDescription} />
            
            </FormControl>
            <Button w="1680px" ml={2} onClick={onSubmit}>
                Create Project
            </Button>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

    </Accordion.Root>
  );
};

export default CreateProjectAccordion;  