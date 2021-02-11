import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Steps } from "../../apicalls/requests";
import { Button, TextField } from "@material-ui/core";
import { constStrings } from "../../utils/constants";

const validationSchema = yup.object({
  text: yup.string("enter step text").required("text is required"),
});

function EditStepTextForm({
  text,
  id,
  afterSubmit,
  handleCancel,
  openSnackbar,
}) {
  const formik = useFormik({
    initialValues: {
      text: text,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      Steps.patch(id, [
        {
          op: "replace",
          path: "/Text",
          value: values.text,
        },
      ]).then((response) => {
        if (response.status === 204) {
          openSnackbar(constStrings.changesSaved);
        } else {
          openSnackbar(constStrings.somethingWentWrongTryAganin);
        }
      });

      afterSubmit(values.text);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth
        id="text"
        name="text"
        label="set new text"
        variant="outlined"
        value={formik.values.text}
        onChange={formik.handleChange}
        error={formik.touched.text && Boolean(formik.errors.text)}
      />
      <Button type="submit" color="secondary">
        save
      </Button>
      <Button onClick={handleCancel}>cancel</Button>
    </form>
  );
}

export default EditStepTextForm;
