export default function bubble(array) {
  for (let i = 1; i < array.length; i++) {
    for (let j = i; j > 0; j--) {
      if (this.compare(array[j], array[j - 1]) < 0) {
        this.swap(array, j, j - 1);
      }
    }
  }

  return array;
};
