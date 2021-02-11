import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Notes } from "../../apicalls/requests";
import { Button, TextField } from "@material-ui/core";
import { constStrings } from "../../utils/constants";

const validationSchema = yup.object({
  text: yup
    .string("enter step text")
    .required("text is required")
    .max(180, "maximum note length is 180 characters"),
});

function EditNoteTextForm({ id, text, afterSubmit, openSnackbar }) {
  const formik = useFormik({
    initialValues: {
      text: text,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      Notes.patch(id, [
        {
          op: "replace",
          path: "/Text",
          value: values.text,
        },
      ]).then((response) => {
        if (response.status === 204) {
          openSnackbar(constStrings.changesSaved);
          afterSubmit(values.text);
        } else {
          openSnackbar(constStrings.somethingWentWrongTryAganin);
        }
      });

      Notes.patch(id, [
        {
          op: "replace",
          path: "/Edited",
          value: true,
        },
      ])
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth
        id="text"
        name="text"
        label="set new text"
        color="secondary"
        variant="outlined"
        value={formik.values.text}
        onChange={formik.handleChange}
        error={formik.touched.text && Boolean(formik.errors.text)}
        inputProps={{ maxLength: 180 }}
      />
      <Button type="submit" color="secondary">
        save
      </Button>
    </form>
  );
}

export default EditNoteTextForm;
