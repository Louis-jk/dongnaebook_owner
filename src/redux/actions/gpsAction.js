import types from "./types"

export function updateGps(current_latlng, user_lat, user_lng, user_address, updateTimeG) {
  return {
    type: types.UPDATE_GPS,
    current_latlng: current_latlng,
    user_lat: user_lat,
    user_lng: user_lng,
    user_address: user_address,
    updateTimeG: updateTimeG,
  }
}
