// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import CustomSnackbarProvider from "../custom-snackbar-provider";

const Component = ({ layout: Layout, children }) => {
  return (
    <CustomSnackbarProvider>
      <Layout>{children}</Layout>
    </CustomSnackbarProvider>
  );
};

Component.propTypes = {
  children: PropTypes.node,
  layout: PropTypes.func
};

Component.displayName = "Layouts";

export default Component;
