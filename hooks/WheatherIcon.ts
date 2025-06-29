import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

const API_KEY = '799a52bb1c40de4073e797cba354a82a';

export const useWeatherIcon = () => {
  const [iconUrl, setIconUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
        );

        const data = await response.json();
        const iconCode = data.weather[0].icon;

        // 👇 This is the line you asked about
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        setIconUrl(iconUrl);
      } catch (error) {
        console.error('Weather fetch failed', error);
      }
    })();
  }, []);

  return iconUrl;
};
