function stringToColor(str: string): string {
  return (
    "#" +
    str
      .split("")
      .reduce((acc, char) => char.charCodeAt(0) + acc, 0)
      .toString(16)
      .slice(0, 6)
  );
}

export  {stringToColor};
