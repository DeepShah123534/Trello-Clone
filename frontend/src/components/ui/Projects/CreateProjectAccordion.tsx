import { Accordion, Span, Box, Input, Textarea, Button } from "@chakra-ui/react";
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control';
import { useState } from "react";
import { Project } from "@/Pages/Projects";

type Props = {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
} 

const CreateProjectAccordion = ({ projects, setProjects} : Props) => {

  const [name, setName] = useState(""); 
  const [description, setDescription] = useState(""); 

  const [submitClickedName, setSubmitClickedName] = useState(false);

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
        console.log('NAME: ', name);
        console.log('DESCRIPTION: ', description);

        setProjects ([
            ...projects,
            {
                name, 
                description,
                status: "To-Do",
            },
        ]);

        setName("");
        setDescription("");
        setSubmitClickedName(false);
    };

  return (
    <Accordion.Root multiple defaultValue={["a"]} border="1px solid" borderColor="gray.300" borderRadius="md">
      <Accordion.Item value="a">
        <Accordion.ItemTrigger>
          <Box display="flex" justifyContent="space-between" alignItems="center" w="100%" px={4} >
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