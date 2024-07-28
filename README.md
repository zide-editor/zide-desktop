# ZIDE 🎨 - AN OPENSOURCE APPLICATION TO CREATE PIXEL ART

---

## Soredewa, what is ZIDE ?
> ZIDE = Zide Is a Design Environment,

## [DEMO LINK](https://youtu.be/fCd_rc3UOm4)

## Table of Contents

- [Motivation](#motivation)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Motivation

We noticed that most pixel art tools are either locked behind paywalls or seem to do everything except pixel art. So, we created ZIDE: an open-source, easy-to-use pixel art app that just works!

## Features

### Pixel Free Draw

You can `draw`, `fill` and `erase` with the built-in tools

### Panning and Zooming

You can `zoom` or `pan` through the edit space

### Animation

You can create multiple frames into 2d-motion

### Render

You can render the drawing as the sprite sheet

## Installation

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js and npm](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Rust and Cargo](https://www.rust-lang.org/tools/install) (required for Tauri CLI)

### Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/zide-editor/zide-desktop.git
   cd zide-desktop
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Install Tauri CLI** (if you haven't already):

   ```bash
   cargo install tauri-cli
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **Build the Tauri application**:

   ```bash
   npm run tauri build
   ```

6. **Run the Tauri application**:

   ```bash
   npm run tauri dev
   ```

## Usage

1. Create a new project
2. Name your project and mention the sprite pixel size
3. Draw, fill and Erase through the edit arena
4. Make multiple frames and make them as Animations
5. Render the sprite sheet with all the frames

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute this software under the terms of the [MIT LICENSE](https://github.com/zide-editor/zide-desktop/blob/main/LICENSE.md)
