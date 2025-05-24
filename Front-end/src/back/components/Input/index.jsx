import { forwardRef } from "react";
import PropTypes from "prop-types";
import MDInputRoot from "./InputRoot";

const MDInput = forwardRef(({ error, success, disabled, ...rest }, ref) => (
  <MDInputRoot {...rest} ref={ref} ownerState={{ error, success, disabled }} />
));

// Setting default values for the props of Input
MDInput.defaultProps = {
  error: false,
  success: false,
  disabled: false,
};

// Typechecking props for the Input
MDInput.propTypes = {
  error: PropTypes.bool,
  success: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default MDInput;
