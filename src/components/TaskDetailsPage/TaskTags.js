import {
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { Fragment } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import EditIcon from "@material-ui/icons/Edit";
import TagChip from "../TagChip";
import { useFormik } from "formik";
import * as yup from "yup";
import { Tasks } from "../../apicalls/requests";
import { constStrings } from "../../utils/constants";

const validationSchema = yup.object({
  newTags: yup.string().nullable(),
});

function TaskTags({ isAuthor, taskId, taskTags, openSnackbar }) {
  const [editTags, setEditTags] = useState(false);
  const [tags, setTags] = useState(taskTags);

  const changeEditTagsState = () => {
    if (isAuthor) {
      const edit = !editTags;
      setEditTags(edit);
    }
  };

  const formik = useFormik({
    initialValues: {
      newTags: tags.join([" "]),
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const updatedTask = {
        editTags: true,
        tags: [],
      };

      let ts = values.newTags.split(" ");
      ts.forEach((tag) => {
        tag = tag.replace(/\W/g, "");
        if (tag.length > 0 && tag.match(/^[0-9a-z]+$/) && !updatedTask.tags.includes(tag)) {
          updatedTask.tags.push(tag);
        }
      });

      Tasks.put(taskId, updatedTask).then((response) => {
        if (response.status === 204) {
          openSnackbar(constStrings.changesSaved);
          setTags(updatedTask.tags);
        } else {
          openSnackbar(constStrings.somethingWentWrongTryAganin);
        }
      });

      values.newTags = updatedTask.tags.join([" "]);

      changeEditTagsState();
    },
  });

  return (
    <Fragment>
      <Box display="flex">
        <Typography variant="subtitle1">tags:</Typography>
        {isAuthor && (
          <Tooltip title="edit tags">
            <IconButton
              aria-label="edit tags"
              size="small"
              onClick={changeEditTagsState}
            >
              {editTags ? <ClearIcon /> : <EditIcon />}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {editTags ? (
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            multiline
            row={4}
            id="newTags"
            name="newTags"
            label="separate tags with space"
            variant="outlined"
            color="secondary"
            value={formik.values.newTags}
            onChange={formik.handleChange}
          />

          <Button type="submit" color="secondary">
            save
          </Button>

          <Button onClick={changeEditTagsState}>cancel</Button>
        </form>
      ) : (
        <Box display="flex" flexWrap="wrap">
          {tags.map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </Box>
      )}
    </Fragment>
  );
}

export default TaskTags;
