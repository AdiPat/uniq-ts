# uniq-ts ✨

A custom implementation of the UNIX `uniq` command line tool in TypeScript. 👾

[Inspired by John Crickett's Coding Challenges.](https://codingchallenges.fyi/challenges/challenge-uniq/)

_From the man page..._

> > The uniq utility reads the specified input_file comparing adjacent lines, and
> > writes a copy of each unique input line to the output_file. If input_file is a
> > single dash (‘-’) or absent, the standard input is read. If output_file is
> > absent, standard output is used for output. The second and succeeding copies
> > of identical adjacent input lines are not written. Repeated lines in the input
> > will not be detected if they are not adjacent, so it may be necessary to sort
> > the files first.

# Setup

**1. Build**

```bash
npm run build
```

**2. Run tests**

```bash
npm run test
```

# Background

I was looking for project ideas to sharpen my skills. I came across Coding Challlenges and found that its a great repository to practise your programming skills over the weekend. This was the kind of project that could be completed in a day or two, or rather few hours so I decided to attempt it. Turns out that re-implementing UNIX utilities is a great way to get better at the craft.
