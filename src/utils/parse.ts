
export function parseGimpPalette(fileContent : string) {
  const lines = fileContent.split('\n');
  const colors = [];

  for (const line of lines) {
    if (line.trim() && !line.startsWith('#')) {
      const [r, g, b, ...nameParts] = line.trim().split(/\s+/);
      const name = nameParts.join(' ');
      const hex = `#${parseInt(r).toString(16).padStart(2, '0')}${parseInt(g).toString(16).padStart(2, '0')}${parseInt(b).toString(16).padStart(2, '0')}`;
      colors.push(hex);
    }
  }

  return colors;
}
