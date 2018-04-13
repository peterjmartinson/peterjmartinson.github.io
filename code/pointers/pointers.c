/**
 * pointer = &variable
 * variable = *pointer
*/
#include <stdio.h>

void changeByValue(int n);
void changeByPointer(int *p);
void incrementArray(int *a, int length);
int * passArray(int n);

int main(void)
{

  int a;
  int b;
  int i;
  int *p1;
  int *p2;
  int *p3;
  int SIZE = 10;
  int arr[SIZE];


  a = 2;
  b = a;
  printf("after 'a=2, b=a'\n  a: %d\n  b: %d\n", a, b);

  a = 6;
  p1 = &a;
  b = *p1;
  *p1 = 7;
  printf("after 'a=6, p1=&a, b=*p1, *p1=7'\n  a: %d\n  b: %d\n", a, b);

  printf("Add 1 to a (%d):\n", a);
  changeByValue(a);
  printf("%d\n", a);
  
  printf("Again, add 1 to a (%d):\n", a);
  changeByPointer(&a);
  printf("%d\n", a);

  printf("\n- Arrays -\n");
  for (i = 0; i < 10; i++) {
    arr[i] = i;
  }

  incrementArray(arr, SIZE);
  
  printf("Result: ");
  for (i = 0; i < 10; i++) {
    arr[i] = i;
  }
  printf("\n");

  p3 = passArray(27);
  printf("Array passed back from function:\n");
  for (i = 0; i < 27; i++) {
    printf("%d ", *(p3+i));
  }
  printf("\n");
  // Doesn't work!!!

}

void changeByValue(int n)
{
  printf("Attempting to change %d ", n);
  n++;
  printf("to %d...\n", n);
}

void changeByPointer(int *p)
{
  printf("Attempting to change %d ", *p);
  (*p)++;
  printf("to %d again, by pointer...\n", *p);
}

void incrementArray(int *a, int length)
{
  int i;
  printf("Adding 1 to each value in the array\n");
  printf("Old Array:\n");
  for (i = 0; i < length; i++) {
    printf("%d ", *(a+i));
  }
  printf("\n");
  
  printf("New Array:\n");
  for (i = 0; i < length; i++) {
    *(a+i) = *(a+i) + 1;
    printf("%d ", *(a+i));
  }
  printf("\n");
  
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











