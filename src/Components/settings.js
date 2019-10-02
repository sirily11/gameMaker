export function getURL(path) {
  let testURL = "http://0.0.0.0/game";
  // let production = "https://lvslzvofwc.execute-api.us-east-1.amazonaws.com/api"
  return `${testURL}${path}`;
}
