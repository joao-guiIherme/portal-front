// utils/mapbox.ts
const MAPBOX_TOKEN = "pk.eyJ1IjoiamdhbHZlczA0IiwiYSI6ImNtYzNweTI0eDA3ZGgya29pazA1dTRqaDUifQ.cgTmHxlFfRtlCDurPEAfKQ";

export const searchCoordinate = async (local: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(local)}.json?access_token=${MAPBOX_TOKEN}`
    );
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lat: lat, lng: lng };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar coordenadas:", error);
    return null;
  }
};
