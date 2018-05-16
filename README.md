= Prototype pollution attack

== Abstract

Prototype pollution is a term that was coined many years ago in the JavaScript community to designate libraries that added extension methods to the prototype of base objects like "Object", "String" or "Function". This was very rapidly considered a bad practice as it introduced unexpected behavior in applications. In this presentation, we will analyze the problem of prototype pollution from a different angle. What if an attacker could pollute the prototype of the base object with his own value? What APIs allow such pollution? What can be done with it?

== Paper

[Link to paper](paper/JavaScript prototype pollution attack in NodeJS.pdf)

== Slides

[Link to slides](slides/index.html)