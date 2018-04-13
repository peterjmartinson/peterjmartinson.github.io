/**
 * pointer = &variable
 * variable = *pointer
*/
#include <stdio.h>

void incrementArray(int *a, int length);
int * passArray(int n);

int main(void)
{

  int i;
  int *p;
  int SIZE = 10;
  int arr[SIZE];


  // Populate the array
  printf("Initialize the array:\n");
  for (i = 0; i < 10; i++) {
    arr[i] = i;
    printf("%d ", arr[i]);
  }
  printf("\n");

  incrementArray(arr, SIZE);
  
  printf("Result:\n");
  for (i = 0; i < 10; i++) {
    arr[i] = i;
    printf("%d ", arr[i]);
  }
  printf("\n");

  /* p = passArray(27); */
  /* printf("Array passed back from function:\n"); */
  /* for (i = 0; i < 27; i++) { */
  /*   printf("%d ", *(p+i)); */
  /* } */
  /* printf("\n"); */
  // Doesn't work!!!

}

void incrementArray(int *a, int length)
{
  int i;
  
  for (i = 0; i < length; i++) {
    *(a+i) = *(a+i) + 1;
  }
  
}

int * passArray(int n)
{
  int arr[n];
  int i;
  int *x;

  for (i = 0; i < n; i++) {
    arr[i] = i;
  }

  x = &arr[0];

  return x;
}












