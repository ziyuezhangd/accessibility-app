export const getAccessibilityHighlightPlaces = async () => {
  const response = await fetch('/api/accessibility-highlight-place');
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }
  const accessibilityHighlightPlaces = await response.json();
  return accessibilityHighlightPlaces;
};
