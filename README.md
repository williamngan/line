# Taking a Line for a Walk

![a drawing gif](./images/hatch.gif)

This is a code experiment to study the expressions of an active line, inspired by Paul Klee's idea of "taking a line for a walk".

Try the [interactive demos](http://williamngan.github.io/line/) and read more about [the concept](https://medium.com/@williamngan/6fd947acb227).

Hope you like this! Please ping me [@williamngan](https://twitter.com/williamngan) if you have questions and feedbacks.

# Code
Just simple prototype code in javascript ES6. Nothing fancy.

Take a look at [LineForm.js](https://github.com/williamngan/line/blob/master/src/js/lines/LineForm.js) which contains a set of functions to create lines.

Then check out [BaseLine](https://github.com/williamngan/line/blob/master/src/js/lines/BaseLine.js) and its extended classes such as [RestatedLine](https://github.com/williamngan/line/blob/master/src/js/lines/RestatedLine.js) to see how a line is animated and drawn.

This uses [Pt.js](https://github.com/williamngan/pt) for drawing. Pt is an experimental library on point, form, and space. And [roll.js](https://github.com/williamngan/roll) which is a little library for scrolling slideshow.


# Compiling
Run `gulp` in Terminal, and take a look at [gulpfile](https://github.com/williamngan/line/blob/master/gulpfile.js).

You may ask: where are the `import xyz`? why not use browserify/webpack/npm/what-not? The answer is that I can't be bothered ;-)