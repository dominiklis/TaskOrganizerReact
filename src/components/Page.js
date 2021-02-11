import React, { useEffect, useState } from "react";
import SideMenu from "./SideMenu";
import AppNavbar from "./AppNavbar";
import { Grid, Hidden, makeStyles, Toolbar } from "@material-ui/core";
import { CheckUser } from "../apicalls/auth";
import { useHistory } from "react-router-dom";
import { Fragment } from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
  },
  content: {
    flexGrow: "5000",
    padding: theme.spacing(1),
  },
}));

function Page({ children }) {
  const history = useHistory();
  const classes = useStyles();

  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const user = CheckUser();
    setLogged(user);

    if (!user) {
      history.push("/signin");
    }
  }, [history]);

  return (
    <div className={classes.container}>
      {logged && (
        <Fragment>
          <AppNavbar />
          <SideMenu />
          <main className={classes.content}>
            <Toolbar />
            <Grid container spacing={2}>
              <Hidden smDown>
                <Grid item xs={2}></Grid>
              </Hidden>
              <Grid item sm={9} xs={12}>
                {children}
              </Grid>
              <Hidden smDown>
                <Grid item xs={1}></Grid>
              </Hidden>
            </Grid>
          </main>
        </Fragment>
      )}
    </div>
  );
}

export default Page;
