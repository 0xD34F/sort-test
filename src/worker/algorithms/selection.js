export default function selection(array) {
  for (let i = 0; i < array.length - 1; i++) {
    let
      minIndex = i,
      minValue = array[i];

    for (let j = i + 1; j < array.length; j++) {
      if (this.compare(minValue, array[j]) > 0) {
        minValue = array[j];
        minIndex = j;
      }
    }

    if (i !== minIndex) {
      this.swap(array, i, minIndex);
    }
  }

  return array;
};
