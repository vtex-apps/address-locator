const GEOLOCATION_TIMEOUT = 30 * 1000
const MAXIMUM_AGE = 3 * 1000

const getCurrentPositionPromise = () => {
  const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: GEOLOCATION_TIMEOUT,
    maximumAge: MAXIMUM_AGE,
  }
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(error.code),
      geolocationOptions
    )
  })
}

export default getCurrentPositionPromise
