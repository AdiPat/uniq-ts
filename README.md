# zuniq ✨

## `uniq` Implementation in TypeScript 👾

A powerful, TypeScript-based reimplementation of the UNIX `uniq` command-line tool. 🚀

Inspired by [John Crickett's Coding Challenges](https://codingchallenges.fyi/challenges/challenge-uniq/), this project is a perfect weekend hackathon for sharpening your TypeScript chops. 🧠💻

---

## 📜 What Is `uniq`?

> The uniq utility reads the specified input_file comparing adjacent lines, and
> writes a copy of each unique input line to the output_file. If input_file is a
> single dash (‘-’) or absent, the standard input is read. If output_file is
> absent, standard output is used for output. The second and succeeding copies
> of identical adjacent input lines are not written. Repeated lines in the input
> will not be detected if they are not adjacent, so it may be necessary to sort
> the files first.

---

## 🚀 Features

- **TypeScript-Powered**: Robust, typed, and clean code for reliability.
- **Lightweight**: Just what you need, no unnecessary fluff. 🪶
- **CLI-Friendly**: Works seamlessly in your terminal. 🖥️

---

## ⚡️ Quick Start

### 1️⃣ Build 🛠️

Compile the code with a single command:

```bash
npm run build
```

### 2️⃣ Test 🧪

Run the tests to ensure everything is functioning perfectly:

```bash
npm run test
```

## 3️⃣ Run 'zuniq'

Build and run the package.

```bash
npm run build
node dist/index.js test_data/test.txt -c
```

---

## 🙌🏽 Shoutout

Special thanks to [John Crickett's Coding Challenges](https://codingchallenges.fyi/) for the inspiration behind this tool. 👏

---

Let’s make the UNIX world a little more TypeScript-y! ⚡
