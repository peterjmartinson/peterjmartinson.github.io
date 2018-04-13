#include <stdio.h>

void changeByPointer(int *p);

int main(void)
{

  int value;
  value = 6;

  printf("Add 1 to %d:\n", value);
  changeByPointer(&value);
  printf("Result: %d\n", value);

}

void changeByPointer(int *p)
{
  (*p)++;
}

