export default function insertion(array) {
  for (let i = 1; i < array.length; i++) {
    let
      x = array[i],
      j = i;

    for (; j > 0 && this.compare(array[j - 1], x) > 0; j--) {
      array[j] = array[j - 1];
    }

    array[j] = x;
  }

  return array;
};
