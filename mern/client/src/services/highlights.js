export const getAccessibilityHighlightPlaces = async () => {
  const response = await fetch('/accessibility-highlight-place');
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }
  const busynessRatings = await response.json();
  return busynessRatings;
};
