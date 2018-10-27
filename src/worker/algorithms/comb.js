export default function comb(array) {
  let
    gap = array.length,
    shrink = 1.3,
    sorted = false;

  while (!sorted) {
    gap = Math.floor(gap / shrink);
    if (gap > 1) {
      sorted = false;
    } else {
      gap = 1;
      sorted = true;
    }

    for (let i = 0; i < array.length - gap; i++) {
      if (this.compare(array[i], array[i + gap]) > 0) {
        this.swap(array, i, i + gap);
        sorted = false;
      }
    }
  }

  return array;
};
