import { Accordion, Span, Box, Input, Textarea, Button } from "@chakra-ui/react";
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control';
import { useState } from "react";

import axios from "axios";
import { UserStory } from "../Feature/FeatureModal";
import { toaster } from "../toaster";
import { useNavigate } from "react-router-dom";

type Props = {
  userStories: UserStory[];
  setUserStories: React.Dispatch<React.SetStateAction<UserStory[]>>;
  featureId: number;
  projectId: number;
} 

const CreateUserStoryAccordion = ({ userStories, setUserStories, featureId, projectId } : Props) => {

  const [name, setName] = useState(""); 
  const [description, setDescription] = useState(""); 
  const navigate = useNavigate();

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
        if (name.trim() !== '') {
          setIsOpen(false);

          const token = localStorage.getItem("token");

          if (!token) {
            toaster.error({
              title: "Not Authenticated",
              description: "Please log in again.",
            });
            navigate('/log-in');
            return;
          }

          axios.post('http://localhost:3000/auth/create-user-story',
            {
              name,
              description,
              projectId,
              featureId,
            },
            { headers: { Authorization: `Bearer ${token}`} }
          ).then((response) => {
            // console.log("User Story created successfully", response.data);
              toaster.success({
                title: "User Story created successfully",
                type: "success", // 👈 "type" determines color/indicator
                closable: true,
             })
            setUserStories (response.data);
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
                navigate('/log-in')
            } else {
              toaster.error({
                  title: "Error",
                  description: "There was an error creating user story try again.",
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
            <Span>Add User Story</Span>
            <Accordion.ItemIndicator />
          </Box>
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody borderTop="1px solid" pb={4}>
            <FormControl pl={10} pr={8} isInvalid={isErrorName} isRequired mb={2}>
                <FormLabel>User Story Name:</FormLabel>
                <Input type="text" value={name} onChange={onchangeName} />
                {!isErrorName ? null : (
                    <FormErrorMessage>User Story Name is required</FormErrorMessage>
                )}
            </FormControl>
            <FormControl pl={10} pr={8} mb={4}>
                <FormLabel>User Story Description:</FormLabel>
                <Textarea  value={description} onChange={onChangeDescription} />
            
            </FormControl>
            <Button width="100%" ml={2} onClick={onSubmit}>
                Create User Story
            </Button>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

    </Accordion.Root>
  );
};

export default CreateUserStoryAccordion;  