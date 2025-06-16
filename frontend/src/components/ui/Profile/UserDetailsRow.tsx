import { Box, IconButton, Text } from "@chakra-ui/react"
type Props = {
    field: string;
    value: string; 
}

const UserDetailsRow = ({field, value}: Props) => {
    return (
        <Box display="flex">
            <Text flex={1} lineHeight="16px">{field}:</Text>
            <Text flex={1} lineHeight="16px">{value}</Text>
            <IconButton
                  aria-label="Edit Name"
                  variant="outline"
                  size="sm" >
                    Edit
            </IconButton>
        </Box>
    )
}

export default UserDetailsRow;