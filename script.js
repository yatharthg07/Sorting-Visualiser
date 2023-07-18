// // Description:
// // This is a webpage that demonstrates how sorting algorithms work. This javascript page is outlined with variables, functions, actions and the algorithms that make this happen. Upon loading the site, the page will auto load a new array, and the buttons/sliders and selector on the page will allow the user to select different variables and execute the sorting algorithm. The user inputs will not be accessible during sorting.

// VARIABLES
let arraysize = document.querySelector("#arraysize").value;
let algorithm = document.querySelector("#algorithm").value;
let speed = document.querySelector("#speed").value;
let heightfactor = 5; // This will be used to make bars taller, as using smaller values makes them harder to see
let bar = document.getElementsByClassName("bar");

const generateNewArrayBtn = document.querySelector("#generateNewArray");
const visualizeBtn = document.querySelector("#visualize");
const arraysizeSlider = document.querySelector("#arraysize");
const speedBtn = document.querySelector("#speed");
const arrayContainer = document.querySelector("#array-container");
const algorithmSelector = document.querySelector("#algorithm");

//  an event listener to the "Stop Sorting" button
const stopSortBtn = document.querySelector("#stopSortBtn");
stopSortBtn.onclick = (e) => {
    stopSorting();
};

// a global variable to track whether the sorting is in progress or stopped
let isSorting = false;
// After loading page, this will create a random graph and render the bars
document.addEventListener("DOMContentLoaded", function () {
  generateNewArray();
});

// USER ACTIONS
generateNewArrayBtn.onclick = function (e) {
  generateNewArray();
};

arraysizeSlider.onchange = (e) => {
  arraysize = document.querySelector("#arraysize").value;
  generateNewArray();
};

speedBtn.onchange = (e) => {
  speed = document.querySelector("#speed").value;
};

algorithmSelector.onchange = (e) => {
  algorithm = document.querySelector("#algorithm").value;
};

visualizeBtn.onclick = async function () {
    // Disable user inputs
    visualizeBtn.disabled = true;
    generateNewArrayBtn.disabled = true;
    arraysizeSlider.disabled = true;
    algorithmSelector.disabled = true;
    speedBtn.disabled = true;

    // Check if the sorting is already in progress
    if (!isSorting) {
        isSorting = true;

        // Execute the selected algorithm based on the selection
        if (algorithm == "bubblesort") {
            await bubblesort([...array]);
        } else if (algorithm == "selectionsort") {
            await selectionsort([...array]);
        } else if (algorithm == "insertionsort") {
            await insertionsort([...array]);
        } else if (algorithm == "quicksort") {
            await quicksort([...array], 0, arraysize - 1);
        } else if (algorithm == "mergesort") {
            // First create a copy of the array to modify - preserve the original array and easier to show array changes
            let arr = [...array]; // Use the spread operator to create a copy of the array
            await mergesort(arr, 0, arraysize - 1); // Pass the copy of the array to mergesort
        } else if (algorithm == "heapsort") {
            await heapsort([...array]);
        } else {
            console.log("no algorithm");
        }

        // Reset isSorting flag and enable user inputs
        isSorting = false;
        reset();
    }
};
 
// FUNCTIONS

function generateNewArray() {
    arrayContainer.innerHTML = ""; // Clears current graph
    array = new Array(arraysize);
    for (let i = 0; i < arraysize; i++) {
        randNum = Math.floor(Math.random() * 100) +1;
        array[i] = randNum;
    }
    renderBars(array);
}

function renderBars(array) {
    for (let i = 0; i < arraysize; i++) {
        let bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = array[i] * heightfactor + "px";
        arrayContainer.appendChild(bar);
    }
}

function reset() {
    // Change graph color to show complete
    for (let m = 0; m < arraysize; m++) {
        bar[m].style.backgroundColor = "green";
    }
    // Enable user inputs
    visualizeBtn.disabled = false;
    generateNewArrayBtn.disabled = false;
    arraysizeSlider.disabled = false;
    algorithmSelector.disabled = false;
    speedBtn.disabled = false;
}

// Time function, delays sorting process for easier visuals
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


// SORTING ALGORITHMS

// SWAP FUNCTION
async function swap(array, i, j) {
    // Swap values
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    // Adjust bar heights
    bar[i].style.height = array[i] * heightfactor + "px";
    bar[j].style.height = array[j] * heightfactor + "px";
}

// BUBBLE SORT
async function bubblesort(array) {
    for (let i = 0; i < arraysize; i++) {
        for (let j = 0; j < arraysize - 1 - i; j++) {
            if (!isSorting) return;

            bar[j].style.backgroundColor = 'yellow';
            bar[j + 1].style.backgroundColor = 'yellow';

            await sleep(speed);

            if (array[j] > array[j + 1]) {
                swap(array, j, j + 1);

                // Highlight swapped bars
                bar[j].style.backgroundColor = 'red';
                bar[j + 1].style.backgroundColor = 'red';

                await sleep(speed);

                // Reset color to default
                bar[j].style.backgroundColor = 'blue';
                bar[j + 1].style.backgroundColor = 'blue';
            }

            // Reset color to default for unswapped bars
            bar[j].style.backgroundColor = 'blue';
            bar[j + 1].style.backgroundColor = 'blue';
        }

        // Highlight the last sorted bar in green
        bar[arraysize - 1 - i].style.backgroundColor = 'green';
    }
    reset();
}

// SELECTION SORT
async function selectionsort(array) {
    for (let i = 0; i < arraysize - 1; i++) {
        let min = i;
        bar[min].style.backgroundColor = 'red';
        for (let j = i + 1; j < arraysize; j++) {
            if (!isSorting) return; // Check the flag before proceeding with each iteration

            bar[j].style.backgroundColor = 'yellow';
            await sleep(speed);

            // If value is lower than the current min, assign it as the new min
            if (array[j] < array[min]) {
                if (min !== i) {
                    bar[min].style.backgroundColor = 'blue';
                }
                min = j;
                bar[min].style.backgroundColor = 'red';
            } else {
                bar[j].style.backgroundColor = 'blue';
            }
        }

        if (min !== i) {
            await swap(array, min, i);
        }

        bar[min].style.backgroundColor = 'blue';
        bar[i].style.backgroundColor = 'green'; // The sorted portion is shown in green
    }
    bar[arraysize - 1].style.backgroundColor = 'green'; // The last element will be sorted
    reset();
}




//INSERTION SORT
async function insertionsort(array) {
    for (let i = 1; i < arraysize; i++) {
        let key = array[i];
        let j = i - 1;
        bar[i].style.backgroundColor = 'red'; // Highlight the element being compared
        await sleep(speed);

        while (j >= 0 && array[j] > key) {
            if (!isSorting) return; // Check the flag before proceeding with each iteration

            bar[j].style.backgroundColor = 'yellow'; // Highlight the element being moved
            array[j + 1] = array[j];
            bar[j + 1].style.height = array[j] * heightfactor + 'px';
            j--;

            await sleep(speed);

            for (let k = i; k >= 0; k--) {
                if (k !== j + 1) {
                    bar[k].style.backgroundColor = 'blue';
                }
            }
        }
        array[j + 1] = key;
        bar[j + 1].style.height = key * heightfactor + 'px';
        bar[i].style.backgroundColor = 'green'; // The sorted portion is shown in green
        await sleep(speed);
    }
    bar[arraysize - 1].style.backgroundColor = 'green'; // The last element will be sorted
    reset();
}



// Merge Sort implementation (updated)
async function mergesort(arr, left, right) {
    if (left >= right) {
        return;
    }

    const mid = Math.floor((left + right) / 2);

    // Recursive calls for left and right halves
    await mergesort(arr, left, mid);
    await mergesort(arr, mid + 1, right);
    await merge(arr, left, mid, right);
}

async function merge(arr, left, mid, right) {
    const n1 = mid - left + 1;
    const n2 = right - mid;

    const L = new Array(n1);
    const R = new Array(n2);

    for (let i = 0; i < n1; i++) {
        L[i] = arr[left + i];
    }
    for (let j = 0; j < n2; j++) {
        R[j] = arr[mid + 1 + j];
    }

    let i = 0;
    let j = 0;
    let k = left;

    while (i < n1 && j < n2) {
        if (!isSorting) return; // Check the flag before proceeding with each iteration

        if (L[i] <= R[j]) {
            arr[k] = L[i];
        bar[k].style.height = arr[k] * heightfactor + "px";
            i++;
        } else {
            arr[k] = R[j];
        bar[k].style.height = arr[k] * heightfactor + "px";
            j++;
        }
      bar[k].style.backgroundColor = "yellow"; // Highlight the current compared bars
        k++;
        await sleep(speed);
    }

    while (i < n1) {
        if (!isSorting) return; // Check the flag before proceeding with each iteration

        arr[k] = L[i];
      bar[k].style.height = arr[k] * heightfactor + "px";
      bar[k].style.backgroundColor = "yellow"; // Highlight the current compared bars
        i++;
        k++;
        await sleep(speed);
    }

    while (j < n2) {
        if (!isSorting) return; // Check the flag before proceeding with each iteration

        arr[k] = R[j];
      bar[k].style.height = arr[k] * heightfactor + "px";
      bar[k].style.backgroundColor = "yellow"; // Highlight the current compared bars
        j++;
        k++;
        await sleep(speed);
    }

    // Reset color of sorted bars
    for (let p = left; p <= right; p++) {
      bar[p].style.backgroundColor = "lightgreen";
    }
}




function find_and_swap(k, x) {
    index_a = k; // current index
    index_b = 0;
    for (let i = 0; i < arraysize; i++) {
        if (array[i] == x) {
            index_b = i;
        }
    }
    swap(array, index_a, index_b);
}

// HEAP SORT 
async function heapsort(array) {
    // Build heap
    for (let i = Math.floor(arraysize / 2); i >= 0; i--) {
        await heapify(array, arraysize, i);
    }
    // Extract each element one by one
    for (let i = arraysize - 1; i >= 0; i--) {
        if (!isSorting) break; // Check the flag before proceeding with each iteration

        swap(array, 0, i); // Swap root with i
        bar[i].style.backgroundColor = "lightgreen";
        await heapify(array, i, 0);
        await sleep(speed);
    }
    reset();
}

async function heapify(array, n, i) {
    let parent = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    // Modify heap, setting max as parent
    if (left < n && array[left] > array[parent]) {
        parent = left;
    }
    if (right < n && array[right] > array[parent]) {
        parent = right;
    }
    // Perform swap and heapify
    if (parent !== i) {
        swap(array, parent, i);
        bar[parent].style.backgroundColor = "yellow";
        bar[i].style.backgroundColor = "yellow";
        await sleep(speed);
        bar[parent].style.backgroundColor = "darkgray";
        bar[i].style.backgroundColor = "darkgray";
        await heapify(array, n, parent);
    }
}

// QUICK SORT
async function quicksort(array, start, end) {
    if (start < end) {
        let pivot = await partition(array, start, end);
        await quicksort(array, start, pivot - 1);
        await quicksort(array, pivot + 1, end);
    }
    if (isSorted(array) === true) reset();
}

async function partition(array, start, end) {
    let pivot = end;
    let i = start - 1;
    let j = start;
    bar[pivot].style.backgroundColor = "red";
    while (j < pivot) {
        if (!isSorting) return; // Check the flag before proceeding with each iteration
        if (array[j] > array[pivot]) {
            j++;
        }
        else {
            i++;
            swap(array, j, i);
            bar[i].style.backgroundColor = "yellow";
            bar[j].style.backgroundColor = "yellow";
            for (let k = 0; k < arraysize; k++) {
                if (k != i && k != j && k != pivot) {
                    bar[k].style.backgroundColor = "darkgray";
                }
            }
            j++;
            await sleep(speed);
        }
    }
    swap(array, i + 1, pivot);
    bar[i + 1].style.backgroundColor = "yellow";
    bar[pivot].style.backgroundColor = "yellow";
    return i + 1;
}

function isSorted(array) {
    let previousNo = null;
    for (const number of array) {
      if (previousNo != null && number < previousNo) {
        return false;
      }
      previousNo = number;
    }
    return true;
}
function stopSorting() {
    isSorting = false;
}
