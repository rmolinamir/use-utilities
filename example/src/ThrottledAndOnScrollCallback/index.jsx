// Libraries
import React, { useState } from "react";

// Global styles
import "./styles.css";

// Hooks
import { useOnScrollCallback } from "use-utilities";

// Components
import Typography from "@material-ui/core/Typography";
import Slider from "./components/slider";

// Dependencies
import randomColor from "randomcolor";

const minimumOffset = 0; // Minimum height offset to actually execute the callback
const initialThrottleLimit = 500; // Minimum time between calls in milliseconds

const Example = () => {
  const [throttleLimit, setThrottleLimit] = useState(
    initialThrottleLimit
  );
  /**
   * We're randomly changing the color of the body when scrolling!
   */
  useOnScrollCallback(minimumOffset, throttleLimit, (event, scrollPosition) => {
    console.log(`Event object:`, event);
    console.log(`I'm currently scrolling at ${Number(scrollPosition).toFixed(0)}px!`);
    document.body.style.backgroundColor = randomColor({
      luminosity: "light",
      format: "hsla" // e.g. 'hsla(27, 88.99%, 81.83%, 0.6450211517512798)'
    });
    document.body.style.transition = `all ease ${throttleLimit}ms`;
  });

  const handleChange = (_, value) => {
    setThrottleLimit(value);
  };

  return (
    <div className="App">
      <div className="fixed">
        <Typography variant="h4" id="label">
          Open the console and scroll the page to see the throttling in action!
        </Typography>
        <br />
        <Typography variant="h4" id="label">
          Feel free to experiment by changing the throttle limit to see a change
          in the frequency of the callbacks.
        </Typography>
        <div className="slider">
          <Typography variant="h4" id="label">
            0
          </Typography>
          <Slider
            value={throttleLimit}
            min={0}
            max={3000}
            onChange={handleChange}
          />
          <Typography variant="h4" id="label">
            3000
          </Typography>
        </div>
      </div>
      <div className="empty-space" />
    </div>
  );
}

export default Example;
