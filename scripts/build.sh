#!/bin/bash
# A basic script to build and compile the typescript files using tsc

# Set an error handler
trap onExit EXIT

# printing the simple stack trace
onExit() {
    while caller $((n++));
    do :;
    done;
}

build() {
    echo 'Start building..'
    # Run tsc
    tsc
    echo 'tsc exist with status code:' $?
    echo 'Copying Other files..'
    cp -rf package.json dist
    cp -rf README.md dist
    echo 'Done.'
    echo '--------'
}

build