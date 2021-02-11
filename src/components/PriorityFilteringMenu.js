import { Button, ButtonGroup } from "@material-ui/core";
import React, { useState } from "react";

function PriorityFilteringMenu({ setPriority }) {
  const [chosenButton, setChosenButton] = useState(0);

  const handleOnclick = (button) => {
    setChosenButton(button);
    if (button === 0) {
      setPriority(null);
    } else {
      setPriority(button - 1);
    }
  };

  return (
    <ButtonGroup
      color="primary"
      size="small"
      aria-label="small outlined button group"
    >
      <Button disabled={chosenButton === 0} onClick={() => handleOnclick(0)}>
        All
      </Button>
      <Button disabled={chosenButton === 1} onClick={() => handleOnclick(1)}>
        Low
      </Button>
      <Button disabled={chosenButton === 2} onClick={() => handleOnclick(2)}>
        Medium
      </Button>
      <Button disabled={chosenButton === 3} onClick={() => handleOnclick(3)}>
        High
      </Button>
    </ButtonGroup>
  );
}

export default PriorityFilteringMenu;
