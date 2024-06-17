export const getAccessibilityHighlightPlaces = async () => {
  const response = await fetch('http://localhost:5050/accessibility-highlight-place');
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }
  const busynessRatings = await response.json();
  return busynessRatings;
};
