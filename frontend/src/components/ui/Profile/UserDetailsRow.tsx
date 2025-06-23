
import { isInvalidEmail } from "../../../Pages/SignUp";
import { Box, IconButton, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import { JSX, useState } from "react";

type Props = {
    field: string;
    value: string; 
    username: string;
}

const UserDetailsRow = ({ field, value, username }: Props): JSX.Element | null => {
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
      alert("Enter a valid email.");
      return;
    }
    else {
        if(valueState === ""){
            alert("The space cannot be empty")
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
        alert("We've updated your account")
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