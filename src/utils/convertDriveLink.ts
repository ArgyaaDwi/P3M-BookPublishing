export function convertDriveLinkToImage(url: string): string {
  const match = url.match(/\/d\/([^/]+)\//);
  return match
    ? `https://drive.google.com/uc?export=view&id=${match[1]}`
    : url;
}
