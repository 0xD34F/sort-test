export default function gnome(array) {
  let
    i = 1,
    j = 2;

  while (i < array.length) {
    if (this.compare(array[i - 1], array[i]) < 0) {
      i = j;
      j++;
    } else {
      this.swap(array, i - 1, i);
      i--;
      if (i === 0) {
        i = j;
        j++;
      }
    }
  }

  return array;
};
