#!/bin/bash

a=( 1 2 3 )
len=${#a[@]}
out=''

for (( i=0; i<len; i++ )); do
  out+='|'
  out+=${a[i]}
done

echo $out

