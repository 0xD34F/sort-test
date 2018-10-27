function heapify(array, index, size) {
  let
    left = 2 * index + 1,
    right = 2 * index + 2,
    largest = index;

  if (left < size && this.compare(array[left], array[index]) > 0) {
    largest = left;
  }

  if (right < size && this.compare(array[right], array[largest]) > 0) {
    largest = right;
  }

  if (largest !== index) {
    this.swap(array, index, largest);
    heapify.call(this, array, largest, size);
  }
}

function buildMaxHeap(array) {
  for (let i = Math.floor(array.length / 2); i >= 0; i--) {
    heapify.call(this, array, i, array.length);
  }
}

export default function heap(array) {
  let size = array.length;
  buildMaxHeap.call(this, array);

  for (let i = array.length - 1; i > 0; i--) {
    this.swap(array, 0, i);
    size--;
    heapify.call(this, array, 0, size);
  }

  return array;
};
