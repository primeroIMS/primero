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

plot 'agg1.csv' using "average":xticlabels(1) title "First Run", \
     'agg2.csv' using "average":xticlabels(1) title "Second Run"
