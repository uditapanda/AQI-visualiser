export function getColorByAQI(aqi) {
  if (aqi <= 50) return '#a8e05f';        // Green
  if (aqi <= 100) return '#fdd64b';       // Yellow
  if (aqi <= 150) return '#ff9b57';       // Orange
  if (aqi <= 200) return '#fe6a69';       // Red
  if (aqi <= 300) return '#a97abc';       // Purple
  return '#a87383';                       // Maroon
}