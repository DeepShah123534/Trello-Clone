import { Box, Button, CloseButton, Dialog, Text } from "@chakra-ui/react"

type Props = {
    isOpen: boolean;
    onClose: () => void;
    itemType: "account" | "project" | "feature" | "user story"; 
    deleteItem: () => void;
}

const DeleteModal = ({ isOpen, onClose, itemType, deleteItem } : Props) => {
    const getAssociatedItems = () => {
        if (itemType === "account") {
          return "projects, features, user stories, tasks" 
        }
        else if(itemType === "project") {
            return "features, user stories, and tasks";
        } else if(itemType === "feature") {
            return "user stories and tasks";
        } else {
            return "tasks";
        }
    }

    const capitalize = () => {
        if (itemType === "account") {
          return "Account" 
        }
        else if(itemType === "project") {
            return "Project";
        } else if(itemType === "feature") {
            return "Feature";
        } else {
            return "User Story";
        }
    }

    return (
    <Dialog.Root placement="center" motionPreset="slide-in-bottom" open={isOpen} onClose={onClose}>
      <Dialog.Trigger >
        
      </Dialog.Trigger>

      {/* <Portal> */}
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>

            <Dialog.Body>
              <Box mt={10}>
              <Text>
                {`Are you sure you want to delete this ${itemType} ? `}
                {`You will be permanently deleteing all associated ${getAssociatedItems()}.`}
                
              </Text>
                
              </Box>

            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild >
                <Button onClick={deleteItem}>{`Delete ${capitalize()}`}</Button>
                
              </Dialog.ActionTrigger>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild >
              <CloseButton  size="sm" onClick={onClose} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      {/* </Portal> */}
    </Dialog.Root>
    );
}

export default DeleteModal;