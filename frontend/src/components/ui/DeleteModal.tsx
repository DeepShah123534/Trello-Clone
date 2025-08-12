import { Box, Button, CloseButton, Dialog, Text } from "@chakra-ui/react"

type Props = {
    isOpen: boolean;
    onClose: () => void;
    itemType: "project" | "feature" | "user story"; 
    deleteItem: () => void;
}

const DeleteModal = ({ isOpen, onClose, itemType, deleteItem } : Props) => {
    const getAssociatedItems = () => {
        if(itemType === "project") {
            return "features, user stories, and tasks";
        } else if(itemType === "feature") {
            return "user stories and tasks";
        } else {
            return "tasks";
        }
    }

    const capitalize = () => {
      if(itemType === "project") {
            return "PROJECT";
        } else if(itemType === "feature") {
            return "FEATURE";
        } else {
            return "USER STORY";
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
                {` Hit Delete to celete OR Close to cancel.`}
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