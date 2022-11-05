import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';

import { fontSizes, spacing } from '../utils/sizes';
import { colors } from '../utils/colors';

const SECOND = 1000;
const MINUTE = 60;
const minutesToMillis = (min) => min * SECOND * MINUTE;
const formatTime = (currentMillis) => (currentMillis < 10 ? `0${currentMillis}` : currentMillis);
export const Countdown = ({ minutes, isPaused, onProgress, onEnd }) => {
  const interval = React.useRef(null);

  const [millis, setMillis] = useState(null);

  const reset = () => setMillis(minutesToMillis(minutes))

  const countDown = () => {
    setMillis((currentMillis) => {
      if (currentMillis <= 0) {
        clearInterval(interval.current);
        onEnd(reset);
        return currentMillis;
      }
      const timeLeft = currentMillis - SECOND;
      return timeLeft;
    });
  };

  useEffect(() => {
    setMillis(minutesToMillis(minutes));
  }, [minutes]);

  useEffect(() => {
    onProgress(millis / minutesToMillis(minutes));
  }, [millis]);

  useEffect(() => {
    if (isPaused) {
      if (interval.current) clearInterval(interval.current);
      return;
    }

    interval.current = setInterval(countDown, SECOND);

    return () => clearInterval(interval.current);
  }, [isPaused]);

  const minute = Math.floor(millis / SECOND / MINUTE) % 60;
  const seconds = Math.floor(millis / SECOND) % 60;
   //puts milliseconds into 00:00 format
  return (
    <Text style={styles.text}>
      {formatTime(minute)}:{formatTime(seconds)}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    color: colors.white,
    padding: spacing.lg,
    backgroundColor: 'rgba(94, 132, 226, 0.3)',
  },
});