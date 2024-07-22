import { useContext} from 'react';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';

export default function StationsLayer() {
  const {markers} = useContext(GoogleMapContext);

  return (
    <>
      {
        markers['station'].map(marker => marker)
      }
    </>
  );
}
