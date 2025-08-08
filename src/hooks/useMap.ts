import { useEffect } from 'react';

export function useMap(
  product: { coords: [string, string][] },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ymaps: any,
  mapRef: React.RefObject<null>,
  selectedPlacemark: number | null,
  setSelectedPlacemark: React.Dispatch<React.SetStateAction<number | null>>,
) {
  useEffect(() => {
    if (!ymaps || !mapRef.current || !product?.coords?.length) {
      return;
    }

    const map = new ymaps.Map(mapRef.current, {
      center: [0, 0],
      zoom: 16,
    });

    map.controls.add('zoomControl', {
      size: 'small',
      position: {
        right: 10,
        top: 100,
      },
    });

    const placemarks = product?.coords.map((address) => {
      const placemark = new ymaps.Placemark([address[0], address[1]], {
        iconShape: {
          type: 'Rectangle',
          coordinates: [
            [-24, -68],
            [24, 0],
          ],
        },
      });

      return placemark;
    });

    placemarks.forEach((placemark) => map.geoObjects.add(placemark));

    if (placemarks.length === 1) {
      map.setCenter(
        [Number(product?.coords?.[0][0]), Number(product?.coords?.[0][1])],
        12,
      );
    } else if (placemarks.length > 1) {
      const bounds = map.geoObjects.getBounds();
      map.setBounds(bounds, { checkZoomRange: true, zoomMargin: 20 });
    }

    // Обработка события закрытия балуна
    map.events.add('balloonclose', () => {
      setSelectedPlacemark(null);
    });
  }, [ymaps, product, selectedPlacemark]);
}
