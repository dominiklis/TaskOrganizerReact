import {
  Box,
  Button,
  Container,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import * as yup from "yup";
import { Auth } from "../apicalls/auth";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  inputField: {
    background: "#f0f0f0",
    marginTop: theme.spacing(2),
  },
  submitButton: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    "&:hover": {},
  },
  link: {
    marginLeft: theme.spacing(1),
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
    },
  },
  errorMsg: {
    color: theme.palette.error.main,
  },
}));

const validationSchema = yup.object({
  email: yup
    .string("enter your email")
    .email("enter a valid email")
    .required("email is required"),
  password: yup
    .string("enter your password")
    .min(6, "password should be of minimum 6 characters")
    .required("password is required"),
});

function SignInPage() {
  const history = useHistory();

  const classes = useStyles();

  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      Auth.signin(values).then((response) => {
        if (response.status === 200) {
          history.push("/");
        } else {
          setIsError(true);
          setErrorMsg(response.response.data);
        }
      });
    },
  });

  return (
    <Container maxWidth="sm" className={classes.container}>
      <Typography variant="h5" color="primary">
        Sign in to Task Organizer
      </Typography>
      {isError && (
        <Typography className={classes.errorMsg} size="small">
          {errorMsg}
        </Typography>
      )}
      <form className={classes.form} onSubmit={formik.handleSubmit}>
        <TextField
          className={classes.inputField}
          fullWidth
          variant="outlined"
          label="email address"
          id="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <TextField
          className={classes.inputField}
          fullWidth
          variant="outlined"
          label="password"
          id="password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          className={classes.submitButton}
          color="secondary"
        >
          Sign In
        </Button>
      </form>

      <Box display="flex">
        <Typography>If you don't have an account yet</Typography>

        <Link to="/signup" className={classes.link}>
          <Typography>Sign Up</Typography>
        </Link>
      </Box>
    </Container>
  );
}

export default SignInPage;
