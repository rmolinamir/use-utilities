// Libraries
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

// Components
import Slider from "@material-ui/lab/Slider";

const styles = {
  root: {
    width: 300
  },
  slider: {
    padding: "22px 0px"
  }
};

const SimpleSlider = props => {
  return (
    <div>
      <Typography variant="h6" id="label">
        Throttle Limit: {Number(props.value).toFixed(0)}ms
      </Typography>
      <br />
      <Slider aria-labelledby="label" min={0} max={30000} {...props} />
    </div>
  );
};

export default withStyles(styles)(SimpleSlider);
