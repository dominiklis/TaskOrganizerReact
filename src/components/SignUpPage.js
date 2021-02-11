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
import { Link } from "react-router-dom";
import { Auth } from "../apicalls/auth";

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
    "&:hover": {
      background: "#32e0c4",
    },
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
    .required("password is required")
    .matches(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
      "password must contains minimum one uppercase, minimum one number and minimum one non alphanumeric character"
    ),
  repeatPassword: yup
    .string("repeat your password")
    .oneOf([yup.ref("password")], "password does not match")
    .required("confirm password is required"),
});

function SignUpPage() {
  const classes = useStyles();

  const history = useHistory();

  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      repeatPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      Auth.signup(values).then((response) => {
        if (response.status === 200) {
          history.push("/");
        } else {
          setIsError(true);
          setErrorMsg(response.response.data[0].description);
        }
      });
    },
  });

  return (
    <Container maxWidth="sm" className={classes.container}>
      <Typography variant="h5" color="primary">
        Create account and start using Task Orginer!
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

        <TextField
          className={classes.inputField}
          fullWidth
          variant="outlined"
          label="repeat password"
          id="repeatPassword"
          name="repeatPassword"
          type="password"
          value={formik.values.repeatPassword}
          onChange={formik.handleChange}
          error={
            formik.touched.repeatPassword &&
            Boolean(formik.errors.repeatPassword)
          }
          helperText={
            formik.touched.repeatPassword && formik.errors.repeatPassword
          }
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          className={classes.submitButton}
          color="secondary"
        >
          Sign Up
        </Button>
      </form>

      <Box display="flex">
        <Typography>Got account?</Typography>

        <Link to="/signin" className={classes.link}>
          <Typography>Sign In</Typography>
        </Link>
      </Box>
    </Container>
  );
}

export default SignUpPage;
