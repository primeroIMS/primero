#!/bin/bash

set title "Average Response Time"
set auto x
set xlabel "Page"
set auto y
set ylabel "Average Response Time (ms)"
set style data histogram
set style histogram cluster gap 1
set style fill solid border -1
set boxwidth 0.9
set xtic scale 0
set xtics rotate out
set datafile separator ","

set term svg
set output output_file

plot agg1_file using "average":xticlabels(1) title agg1_title, \
     agg2_file using "average":xticlabels(1) title agg2_title
