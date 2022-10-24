import { Box, CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export default function Clock({ count = 10, onStop }) {
  const [time, setTime] = useState(count);

  useEffect(() => {
    setTime(count);
  }, [count]);

  useEffect(() => {
    let timer = null;
    if (count > 0) {
      timer = setInterval(() => {
        setTime((t) => {
          if (t <= 1) {
            onStop();
            clearInterval(timer);
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box textAlign="center">
      <CircularProgress value={time * 10} color="#2c7a7b" size={100}>
        <CircularProgressLabel fontWeight={600}>{time}s</CircularProgressLabel>
      </CircularProgress>
    </Box>
  );
}
