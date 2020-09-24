import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Divider,
  FormControlLabel,
  Checkbox,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Alert from '@material-ui/lab/Alert';

import { Form } from 'react-final-form';
import { TextField, Radios, Checkboxes } from 'mui-rff';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: 'flex',
    flexDirection: 'column'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  signInButton: {
    marginTop: 20
  }
}));

const CreatePackage = props => {
  const { className, ...rest } = props;
  const {
    loading,
    data: { getPacks: datas }
  } = useQuery(FETCH_PACK_QUERY);
  let itemsToRender;
  if (datas) {
    itemsToRender = datas.map(item => {
      return (
        <TableRow key={item.id}>
          <TableCell>{item.label}</TableCell>
          <TableCell>{item.value}</TableCell>
          <TableCell>
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => {
                console.log({ item });
              }}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
  }
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [opend, setOpend] = useState(false);
  const [errors, setErrors] = useState({});
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const [values, setValues] = useState({
    label: '',
    value: ''
  });

  const [createPack] = useMutation(CREATE_PACK, {
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_PACK_QUERY
      });
      data.getPacks = [result.data.createPack, ...data.getPacks];
      //console.table('after' + JSON.stringify(data.getPacks, null, '\t'));
      proxy.writeQuery({ query: FETCH_PACK_QUERY, data });
      setOpen(false);
      setValues({ label: '', value: '' });
    },
    onError(err) {
      setOpen(false);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });
  const onSubmit = async values => {
    setOpen(!open);
    await sleep(300);
    setValues({ ...values, values });
    createPack();
  };
  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={opend}
        autoHideDuration={2000}
        onClose={() => {
          setOpend(false);
        }}>
        <Alert
          onClose={() => {
            setOpend(false);
          }}
          severity="success">
          Package Added Succuessfullyyy!
        </Alert>
      </Snackbar>
      <CardHeader
        subheader=" Add Delete and Manage the Package"
        title="Manage the Package"
      />
      <Divider />
      <CardContent>
        <Grid container spacing={6} wrap="wrap">
          <Grid className={classes.item} item md={12}>
            <Form
              onSubmit={onSubmit}
              render={({
                handleSubmit,
                form,
                submitting,
                pristine,
                values
              }) => (
                <form
                  onSubmit={event => {
                    const promise = handleSubmit(event);
                    promise &&
                      promise.then(() => {
                        form.reset();
                      });
                    return promise;
                  }}
                  noValidate>
                  <Grid container spacing={6} wrap="wrap">
                    <Grid className={classes.item} item md={4}>
                      <TextField
                        className={classes.textField}
                        fullWidth
                        required={true}
                        label="Enter package name"
                        name="label"
                        variant="outlined"
                        type="text"
                      />
                    </Grid>
                    <Grid className={classes.item} item md={4}>
                      <TextField
                        className={classes.textField}
                        required={true}
                        fullWidth
                        label="Enter package price"
                        name="value"
                        variant="outlined"
                        type="number"
                      />
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    className={classes.signInButton}
                    disabled={submitting || pristine}
                    color="primary"
                    size="large"
                    variant="contained">
                    Add package
                  </Button>
                  {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
                </form>
              )}
            />
          </Grid>
          <Grid className={classes.item} item md={12}>
            <Typography gutterBottom variant="h6">
              Package list
            </Typography>
            <PerfectScrollbar>
              <div className={classes.inner}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Package Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{itemsToRender}</TableBody>
                </Table>
              </div>
            </PerfectScrollbar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const CREATE_PACK = gql`
  mutation createPack($label: String!, $value: String!) {
    createPack(label: $label, value: $value) {
      id
      label
      value
    }
  }
`;

const FETCH_PACK_QUERY = gql`
  {
    getPacks {
      id
      label
      value
    }
  }
`;

CreatePackage.propTypes = {
  className: PropTypes.string
};

export default CreatePackage;
