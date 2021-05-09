import "./App.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useSound from "use-sound";
import useMeasure from "react-use-measure";
import * as R from "ramda";
import { animated, useSpring } from "react-spring";

import { Sounds } from "./sounds";

function App() {
  const sorted = useMemo(() => R.sortBy(R.prop("name"), Sounds), []);

  return (
    <div className="App">
      <SoundBoard>
        {sorted.map((s, idx) => (
          <SoundButtonLayout key={`sound-${idx}}`}>
            <SoundButton {...s} />
          </SoundButtonLayout>
        ))}
      </SoundBoard>
    </div>
  );
}

const SoundBoard = ({ children }) => (
  <div className="SoundBoard">{children}</div>
);

const SoundButtonLayout = ({ children }) => (
  <div className="SoundButtonLayout">{children}</div>
);

const SoundButton = ({ name, src }) => {
  const [, setCount] = useState(0);
  const [play, { stop, isPlaying, duration }] = useSound(src);
  const [ref, bounds] = useMeasure();
  const styles = useSpring({
    config: { duration },
    from: { width: 0 },
    to: { width: bounds.width },
    reset: isPlaying,
  });

  const onClick = useCallback(() => {
    if (isPlaying) {
      // Hack to make the animation restart. Shrug.
      setCount((prev) => prev + 1);
      stop();
    }

    play();
  }, [stop, play, isPlaying]);

  useEffect(() => stop, [stop]);

  return (
    <>
      <button ref={ref} className="SoundButton" onClick={onClick}>
        {name}
        {isPlaying && <animated.div className="fill" style={styles} />}
      </button>
    </>
  );
};

export default App;
