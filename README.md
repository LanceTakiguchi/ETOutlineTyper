# ET Outline Typer
A typing practice application for an evangelism outline.

Live Link: [ET Outline Typer - https://lancetakiguchi.github.io/ETOutlineTyper/index.html](https://lancetakiguchi.github.io/ETOutlineTyper/index.html)

* Birth of Idea: Long time idea and useful need at my church. 
    * Problems 
        * hard to practice by yourself. How do you know you said the verse verbatum
        * Tedious to check yourself (especially if you type out the whole doc)
        * Only given a paper, have to create note cards to practice
        * After class is over - Binder not around, hard to review

    * Solution - a typing app
        * Notes at the character when you've got an error
        * Easy to do anywhere (mobile friendly)

* Can be hosted on the church website or my own website

## Setup
* in the terminal, use `npm install`

## Commands

### Run Locally
* in the terminal, use `npm run dev`
* go to http://localhost:5173/ in browser.

### Deploy
* Auto deploys went pushing to the branch, "main"
* Manual: You can use `npm run deploy` in terminal

## Todo:
* Fix the json "number" / "section" based on a fresh copy of the outline
    * Blocked 🧊: Waiting on friend to provide copy and day divisions.
* Fix the days to the real days.
    * Blocked 🧊: Waiting on friend to provide day divisions.
* Don't expect users to type new lines, auto new line for them.
* Don't use a text area. use an input. Ones the line is complete, create a new line, lock in the old section as HTML.
* dark mode
* Updates readme.md
   * commands
   * Update tech description
* make mobile friendly
* Gradual give a hint for the next character
* Check if you need to use backspace to delete.
* Add a reset button

## Manual QA:
* Scroll check the preview
* Resize the window

## Updates
* 2/12/2026 - LT
    * Feature: Allow a preview of the outline.
    * Feature: ghost visibility.
