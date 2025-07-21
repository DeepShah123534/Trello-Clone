import { Accordion, Span, Box, Input, Textarea, Button } from "@chakra-ui/react";
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control';
import { useState } from "react";

import axios from "axios";
import { Feature } from "@/Pages/Project";

type Props = {
  features: Feature[];
  setFeatures: React.Dispatch<React.SetStateAction<Feature[]>>;
  projectId: number;
} 

const CreateFeatureAccordion = ({ features, setFeatures, projectId } : Props) => {

  const [name, setName] = useState(""); 
  const [description, setDescription] = useState(""); 

  const [submitClickedName, setSubmitClickedName] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

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

          axios.post('http://localhost:3000/auth/create-feature',
            {
              name,
              description,
              projectId,
            },
            { headers: { Authorization: `Bearer ${token}`} }
          ).then((response) => {
            console.log("Project created successfully", response.data);
            setFeatures (response.data);
            setName("");
            setDescription("");
            setSubmitClickedName(false);
          }).catch ((error) => {

            console.log('ERROR', error);

            alert("There was an error creating feature try again")
          })

        }
    };

  return (
    <Accordion.Root collapsible index={isOpen ? [0] : [1]}   border="1px solid" borderColor="gray.300" borderRadius="md">
      <Accordion.Item >
        <Accordion.ItemTrigger onClick={() => setIsOpen(false)} >
          <Box display="flex" justifyContent="space-between" alignItems="center" w="100%" px={4}  onClick={() => setIsOpen(!isOpen)} >
            <Span>Add Feature</Span>
            <Accordion.ItemIndicator />
          </Box>
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody borderTop="1px solid" pb={4}>
            <FormControl pl={10} pr={8} isInvalid={isErrorName} isRequired mb={2}>
                <FormLabel>Feature Name:</FormLabel>
                <Input type="text" value={name} onChange={onchangeName} />
                {!isErrorName ? null : (
                    <FormErrorMessage>Feature Name is required</FormErrorMessage>
                )}
            </FormControl>
            <FormControl pl={10} pr={8} mb={4}>
                <FormLabel>Feature Description:</FormLabel>
                <Textarea  value={description} onChange={onChangeDescription} />
            
            </FormControl>
            <Button w="1680px" ml={2} onClick={onSubmit}>
                Create Feature
            </Button>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

    </Accordion.Root>
  );
};

export default CreateFeatureAccordion;  