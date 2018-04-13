/**
 * pointer = &variable
 * variable = *pointer
*/
#include <stdio.h>

void changeByValue(int n);

int main(void)
{

  int value;
  value = 6;

  printf("Add 1 to %d:\n", value);
  changeByValue(value);
  printf("Result: %d\n", value);
  
}

void changeByValue(int n)
{
  n++;
}

