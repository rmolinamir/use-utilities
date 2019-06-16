// Libraries
import React, { useState } from "react";

// Global styles
import "./styles.css";

// Hooks
import { useCallbackQueue } from "use-utilities";
// Components
import Typography from "@material-ui/core/Typography";
import Slider from "./components/slider";

// Dependencies
import randomColor from "randomcolor";
const initialThrottleLimit = 50; // Minimum time between calls in milliseconds

const Example = () => {
  const [throttleLimit, setThrottleLimit] = useState(
    initialThrottleLimit
  );
  /**
   * We're randomly changing the color of the body when scrolling!
   */
  const handleChange = (_, value) => {
    setThrottleLimit(value);
  };

  const callback = event => {
    console.log("Event", event);
    document.body.style.backgroundColor = randomColor({
      luminosity: "light",
      format: "hsla" // e.g. 'hsla(27, 88.99%, 81.83%, 0.6450211517512798)'
    });
    document.body.style.transition = 'transition ease 0ms';
  };
  const useHandleOnScroll = useCallbackQueue(callback, throttleLimit);

  React.useEffect(() => {
    window.addEventListener("scroll", useHandleOnScroll);

    // Return clause.
    return () => window.removeEventListener("scroll", useHandleOnScroll);
  }, [useHandleOnScroll]);

  return (
    <div className="App">
      <div className="fixed">
        <Typography variant="h4" id="label">
          Open the console and scroll the page to see the JavaScript Queue in
          action!
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
