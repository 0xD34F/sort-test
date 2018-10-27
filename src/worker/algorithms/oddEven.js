export default function oddEven(array) {
  let sorted = false;

  while (!sorted) {
    sorted = true;

    for (let i = 1; i < array.length - 1; i += 2) {
      if (this.compare(array[i], array[i + 1]) > 0) {
        this.swap(array, i, i + 1);
        sorted = false;
      }
    }

    for (let i = 0; i < array.length - 1; i += 2) {
      if (this.compare(array[i], array[i + 1]) > 0) {
        this.swap(array, i, i + 1);
        sorted = false;
      }
    }
  }

  return array;
};
