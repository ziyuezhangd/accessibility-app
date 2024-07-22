import { useContext } from 'react';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';

export default function RestroomLayer() {
  const { markers } = useContext(GoogleMapContext);

  return (
    <>{markers['restroom'].map(marker => marker)}</>
  );
}
