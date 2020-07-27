import { useState, useEffect } from "react";
import {
  Accuracy,
  requestPermissionsAsync,
  watchPositionAsync,
} from "expo-location";

export default (shouldTrack, callback) => {
  const [err, setErr] = useState(null);
  const [subscriber, setSubscriber] = useState(null);
  const startWatching = async () => {
    try {
      const { granted } = await requestPermissionsAsync();
      //We tried to get an update one every second
      if (!granted) {
        throw new Error("Location permission not granted");
      }
      const sub = await watchPositionAsync(
        {
          accuracy: Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        callback
      );
      //
      setSubscriber(sub);
    } catch (e) {
      setErr(e);
    }
  };
  //If shouldTrack  value changes the react will run startWatching() function
  useEffect(() => {
    if (shouldTrack) {
      startWatching();
    } else {
      //stop watching
      subscriber.remove();
      setSubscriber(null);
    }
  }, [shouldTrack]);

  return [err];
};
