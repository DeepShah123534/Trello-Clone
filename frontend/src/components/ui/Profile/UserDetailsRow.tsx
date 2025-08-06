
import { isInvalidEmail } from "../../../Pages/SignUp";
import { Box, IconButton, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import { JSX, useState } from "react";
import { Data } from "../../../Pages/Profile";
import { toaster } from "../toaster";



type Props = {
    field: string;
    value: string; 
    username: string;
    setData: React.Dispatch<React.SetStateAction<Data>>;
}

const UserDetailsRow = ({ field, value, username, setData}: Props): JSX.Element | null => {
  const [updateField, setUpdateField] = useState(false);
  const [valueState, setValueState] = useState(value);

  const onChange = (e: any) => {
    setValueState(e.target.value);
  };

  const onClickEdit = () => {
    setUpdateField(true);
  };

  const onClickCheck = () => {
    if (field === "Email" && isInvalidEmail(valueState)) {
      toaster.error({
              title: "Error",
              description: "The space cannot be empty.",
              closable: true,
    });
      setValueState(value);
      return;
    }
    else {
        if(valueState === ""){
            toaster.error({
              title: "Error",
              description: "The space cannot be empty.",
              closable: true,
            });

            if(field !== "Password"){
              setValueState(value);
            }
            
            return;
        }
    }

    const token = localStorage.getItem("token");

    setUpdateField(false);

    axios
      .post("http://localhost:3000/auth/change-account-detail", {
        username,
        field: field.toLowerCase(),
        value: valueState,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("RESPONSE", response.data);
        setData(response.data)
        alert("We've updated your account")
      }).catch((error) => {
        console.log('ERROR', error)
        alert("There was an error. Please review your information and try again");
      });

  };

  return (
    <Box display="flex" gap={2}>
      <Text flex={1} lineHeight="16px">{field}:</Text>
      {updateField ? (
        <Input
          flex={1}
          h="32px"
          value={valueState}
          onChange={onChange}
          type={field === "Password" ? "password" : "text"}
        />
      ) : (
        <Text flex={1} lineHeight="16px">
          {field === "Password" ? "********" : valueState}
        </Text>
      )}
      <IconButton
        aria-label="Edit"
        variant="outline"
        size="sm"
        onClick={updateField ? onClickCheck : onClickEdit}
      >
        {updateField ? "✔" : "✏️"}
      </IconButton>
    </Box>
  );
};

export default UserDetailsRow;